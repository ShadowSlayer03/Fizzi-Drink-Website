"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import headerClassMapper from "@/constants/headerClassMapper";

export default function HeaderWrapper() {
  const pathname = usePathname();

  const headerClass = headerClassMapper.find((val)=>val.path===pathname);

  return <Header className={headerClass?.className} />;
}
