"use client";

import { usePathname } from "next/navigation";
import Footer from "../Footer";
import footerClassMapper from "@/constants/footerClassMapper";

export default function FooterWrapper() {
  const pathName = usePathname();

  const footerClass = footerClassMapper.find((val)=>val.path===pathName);

  return <Footer className={footerClass?.className}/>;
}
