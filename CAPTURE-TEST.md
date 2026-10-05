# Capture test

Tool: Cursor. Model: Grok 4.7, hook-recorded slug `grok-4.7-high-fast`. The same model plans and executes. No separate planner.

Mechanism: Cursor project hooks. Config `.cursor/hooks.json`. Script `.cursor/hooks/capture.py`. Events: `beforeSubmitPrompt` appends the prompt verbatim; `afterAgentResponse` keeps only the latest assistant text; `stop` writes that text once as the response. Thinking is not hooked.

Log files the canaries landed in:

- `.agent-logs/2026-10-05_21-38-09_110ba76f-cde1-4ae0-8081-0afc3d4dcf32.md`
- `.agent-logs/2026-10-05_21-38-12_de848483-e7e9-4425-9b99-405773f0ba40.md`

What was tried first that did not work: on-disk agent transcripts include thinking and tool calls so they were rejected as the log source; the `cursor` CLI could not open a second Agent chat from inside the session; a stdin simulation of the script proved the formatter but was not the live hook; the original setup prompt was not captured because the hook did not exist yet; `chmod` on the hook script failed inside the sandbox until it was run outside the sandbox.

## Canary — session `110ba76f`

Later non-canary entries exist in this file (PROMPT/RESPONSE num=2, the storefront assignment). The canary pair below is pasted raw.

````
[LOG_ENTRY type=PROMPT num=1 session=110ba76f]
timestamp: 2026-10-05T21:38:09.139Z
model: grok-4.7-high-fast

CAPTURE TEST — 8x assignment, Melal-F


[LOG_ENTRY type=RESPONSE num=1 session=110ba76f]
timestamp: 2026-10-05T21:39:12.552Z
model: grok-4.7-high-fast

The second chat is fully captured. This chat has the prompt, and the response is written when the turn ends.

**Second session** — `.agent-logs/2026-10-05_21-38-12_de848483-e7e9-4425-9b99-405773f0ba40.md` has both entries. The hook fired in a chat that did not create it. The model slug on both lines is `grok-4.7-high-fast`.

```
[LOG_ENTRY type=PROMPT num=1 session=de848483]
timestamp: 2026-10-05T21:38:12.891Z
model: grok-4.7-high-fast

CAPTURE TEST — 8x assignment, Melal-F


[LOG_ENTRY type=RESPONSE num=1 session=de848483]
timestamp: 2026-10-05T21:38:24.031Z
model: grok-4.7-high-fast

Capture test received.

- **Assignment:** 8x
- **Author:** Melal-F
- **Project:** amazone-clone
- **Prompt:** CAPTURE TEST — 8x assignment, Melal-F
```

**This session** — `.agent-logs/2026-10-05_21-38-09_110ba76f-cde1-4ae0-8081-0afc3d4dcf32.md` has the prompt at `2026-10-05T21:38:09.139Z`. The response entry is appended by the `stop` hook after this reply is sent, so it is not in the file yet.

`CAPTURE-TEST.md` is not written. Pasting this reply as the logged response before the hook writes it would be fake. Send one more message and I will confirm this session’s response line, then write `CAPTURE-TEST.md`.
````

## Canary — session `de848483`

This file contains only the canary exchange. Pasted raw.

```
[LOG_ENTRY type=PROMPT num=1 session=de848483]
timestamp: 2026-10-05T21:38:12.891Z
model: grok-4.7-high-fast

CAPTURE TEST — 8x assignment, Melal-F


[LOG_ENTRY type=RESPONSE num=1 session=de848483]
timestamp: 2026-10-05T21:38:24.031Z
model: grok-4.7-high-fast

Capture test received.

- **Assignment:** 8x
- **Author:** Melal-F
- **Project:** amazone-clone
- **Prompt:** CAPTURE TEST — 8x assignment, Melal-F
```
