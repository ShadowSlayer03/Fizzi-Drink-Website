import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import "./index.css";

import localFont from 'next/font/local'
import ViewCanvas from "@/components/ViewCanvas";
import Footer from "@/components/Footer";
import HeaderWrapper from "@/components/wrapper/HeaderWrapper";
import FooterWrapper from "@/components/wrapper/FooterWrapper";

export const alpino = localFont({
  src: '../../public/fonts/Alpino-Variable.woff2',
  display: "swap",
  weight: "100 900",
  variable: "--font-alpino"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={alpino.variable}>
      <head>
        <link rel="icon" href="/icon.svg" />
      </head>
      <body className="overflow-x-hidden bg-yellow-300">
        <HeaderWrapper />
        <main>
          {children}
          <ViewCanvas />
        </main>
        <FooterWrapper />
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
