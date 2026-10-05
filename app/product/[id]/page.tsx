import { ProductView } from "@/components/ProductView";
import { getProduct } from "@/lib/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product?.title ?? "Product" };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getProduct(id)) notFound();
  return <ProductView id={id} />;
}
