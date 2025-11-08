import { type Metadata } from "next";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function FindStores() {
  const client = createClient();
  const findStores = await client.getByUID("find_stores", "find-stores");

  return <SliceZone slices={findStores.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const findStores = await client.getByUID("find_stores", "find-stores");

  return {
    title: findStores.data.meta_title,
    description: findStores.data.meta_description,
    openGraph: {
      title: findStores.data.meta_title ?? undefined,
      images: [{ url: findStores.data.meta_image?.url ?? "" }],
    },
  };
}
