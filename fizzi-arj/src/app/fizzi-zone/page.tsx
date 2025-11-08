import { type Metadata } from "next";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function FizziFun() {
  const client = createClient();
  const fizziFun = await client.getByUID("fizzifunpage", "fizzi-fun");

  return <SliceZone slices={fizziFun.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const fizziFun = await client.getByUID("fizzifunpage", "fizzi-fun");

  return {
    title: asText(fizziFun.data.title),
    description: fizziFun.data.meta_description,
    openGraph: {
      title: fizziFun.data.meta_title ?? undefined,
      images: [{ url: fizziFun.data.meta_image?.url ?? "" }],
    },
  };
}
