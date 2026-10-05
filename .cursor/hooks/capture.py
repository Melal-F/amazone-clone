#!/usr/bin/python3
"""Append each user prompt and the final assistant response to .agent-logs/.

Fires from Cursor project hooks. Thinking, tool calls, and earlier assistant
messages in the same turn are not written. The last afterAgentResponse text
is flushed once, on stop (or on afterAgentResponse if stop already ran).
"""

import fcntl
import json
import os
import sys
from pathlib import Path

AUTHOR = "Melal-F"
TOOL = "cursor"
PROJECT = "amazone-clone"

ROOT = (
    Path(os.environ["CAPTURE_ROOT"])
    if os.environ.get("CAPTURE_ROOT")
    else Path(__file__).resolve().parents[2]
)
LOG_DIR = ROOT / ".agent-logs"
STATE_DIR = ROOT / ".cursor" / "hooks" / "state"


def utc_now():
    from datetime import datetime, timezone

    now = datetime.now(timezone.utc)
    return now.strftime("%Y-%m-%dT%H:%M:%S.") + f"{now.microsecond // 1000:03d}Z"


def session_id(payload):
    return payload.get("conversation_id") or payload.get("session_id") or ""


def short_id(value):
    return value.split("-", 1)[0][:8]


def model_name(payload):
    model = (payload.get("model") or "").strip()
    model_id = (payload.get("model_id") or "").strip()
    if model_id and model in ("", "default"):
        return model_id
    return model or model_id or "unknown"


def safe_part(value):
    return "".join(ch if ch.isalnum() or ch in "-_" else "_" for ch in value)


class Lock:
    def __init__(self, sid):
        self.path = STATE_DIR / f"{safe_part(sid)}.lock"

    def __enter__(self):
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        self.fh = open(self.path, "a+")
        fcntl.flock(self.fh, fcntl.LOCK_EX)
        return self

    def __exit__(self, *_):
        fcntl.flock(self.fh, fcntl.LOCK_UN)
        self.fh.close()


def meta_path(sid):
    return STATE_DIR / safe_part(sid) / "meta.json"


def gen_path(sid, generation_id):
    return STATE_DIR / safe_part(sid) / f"{safe_part(generation_id or 'unknown')}.json"


def read_json(path):
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data), encoding="utf-8")


def render_header(sid, date, model, total, first_ts, last_ts):
    short = short_id(sid)
    return (
        "---\n"
        f"session_id: {sid}\n"
        f"date: {date}\n"
        f"author: {AUTHOR}\n"
        f"model: {model}\n"
        f"tool: {TOOL}\n"
        f"project: {PROJECT}\n"
        f"total_exchanges: {total}\n"
        f"first_prompt_time: {first_ts}\n"
        f"last_prompt_time: {last_ts}\n"
        "---\n"
        "\n"
        f"# Session Log - {date}\n"
        "\n"
        f"Session: `{short}` | Project: `{PROJECT}` | Author: `{AUTHOR}`\n"
        "\n"
        "---\n"
    )


def set_header_field(text, key, value):
    lines = text.split("\n")
    in_yaml = False
    for i, line in enumerate(lines):
        if line == "---":
            if not in_yaml:
                in_yaml = True
                continue
            break
        if in_yaml and line.startswith(key + ":"):
            lines[i] = f"{key}: {value}"
            break
    return "\n".join(lines)


def render_entry(kind, num, sid, ts, model, body):
    if not body.endswith("\n"):
        body += "\n"
    return (
        "\n"
        f"[LOG_ENTRY type={kind} num={num} session={short_id(sid)}]\n"
        f"timestamp: {ts}\n"
        f"model: {model}\n"
        "\n"
        f"{body}\n"
    )


def on_prompt(payload):
    sid = session_id(payload)
    if not sid or payload.get("prompt") is None:
        return
    ts = utc_now()
    model = model_name(payload)
    with Lock(sid):
        meta = read_json(meta_path(sid))
        if not meta:
            date = ts[:10]
            stamp = ts[:19].replace("T", "_").replace(":", "-")
            path = LOG_DIR / f"{stamp}_{safe_part(sid)}.md"
            LOG_DIR.mkdir(parents=True, exist_ok=True)
            path.write_text(
                render_header(sid, date, model, 0, ts, ts), encoding="utf-8"
            )
            meta = {"file": str(path)}
        path = Path(meta["file"])
        num = int(meta.get("next_num") or 1)
        text = path.read_text(encoding="utf-8")
        text = set_header_field(text, "total_exchanges", str(num))
        text = set_header_field(text, "last_prompt_time", ts)
        text += render_entry("PROMPT", num, sid, ts, model, payload["prompt"])
        path.write_text(text, encoding="utf-8")
        meta["next_num"] = num + 1
        write_json(meta_path(sid), meta)
        write_json(
            gen_path(sid, payload.get("generation_id")),
            {
                "num": num,
                "file": str(path),
                "session_id": sid,
                "response_written": False,
            },
        )


def flush_response(state, path):
    if state.get("response_written") or state.get("response_text") is None:
        return state
    log_path = Path(state["file"])
    existing = log_path.read_text(encoding="utf-8")
    existing += render_entry(
        "RESPONSE",
        state["num"],
        state["session_id"],
        state.get("response_ts") or utc_now(),
        state.get("response_model") or "unknown",
        state["response_text"],
    )
    log_path.write_text(existing, encoding="utf-8")
    state["response_written"] = True
    write_json(path, state)
    return state


def on_response(payload):
    sid = session_id(payload)
    if not sid:
        return
    path = gen_path(sid, payload.get("generation_id"))
    with Lock(sid):
        state = read_json(path)
        if "num" not in state:
            return
        state["response_text"] = payload.get("text") if payload.get("text") is not None else ""
        state["response_ts"] = utc_now()
        state["response_model"] = model_name(payload)
        write_json(path, state)
        if state.get("stop_seen"):
            flush_response(state, path)


def on_stop(payload):
    sid = session_id(payload)
    if not sid:
        return
    path = gen_path(sid, payload.get("generation_id"))
    with Lock(sid):
        state = read_json(path)
        if "num" not in state or state.get("response_written"):
            return
        if state.get("response_text") is None:
            state["stop_seen"] = True
            write_json(path, state)
            return
        flush_response(state, path)


def main():
    raw = sys.stdin.read()
    try:
        payload = json.loads(raw) if raw.strip() else {}
    except json.JSONDecodeError:
        payload = {}
    event = payload.get("hook_event_name") or ""
    try:
        if event == "beforeSubmitPrompt":
            on_prompt(payload)
        elif event == "afterAgentResponse":
            on_response(payload)
        elif event == "stop":
            on_stop(payload)
    except Exception as exc:
        print(f"capture hook error: {exc}", file=sys.stderr)
    if event == "beforeSubmitPrompt":
        sys.stdout.write('{"continue": true}\n')
    else:
        sys.stdout.write("{}\n")


if __name__ == "__main__":
    main()
