import { type Metadata } from "next";

import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import LoaderWrapper from "@/components/wrapper/LoaderWrapper";

export default async function Home() {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return (
  // <LoaderWrapper>
      <SliceZone slices={home.data.slices} components={components} />
    // </LoaderWrapper>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return {
    title: asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? "" }],
    },
  };
}
