import { type Metadata } from "next";
import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Contact() {
  const client = createClient();
  const contact = await client.getByUID("contactuspage", "contact-us");

  return <SliceZone slices={contact.data.slices} components={components} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const contact = await client.getByUID("contactuspage", "contact-us");

  return {
    title: asText(contact.data.title),
    description: contact.data.meta_description,
    openGraph: {
      title: contact.data.meta_title ?? undefined,
      images: [{ url: contact.data.meta_image?.url ?? "" }],
    },
  };
}
