import React from "react";
import FizziLogo  from "./FizziLogo";
import CircularText from "./CircularText";
import clsx from "clsx";

type Props = {
  className?: string
};

export default function Footer({ className }: Props) {
  return (
    <footer className={clsx("bg-[#FEE832]", className)}>
      <div className="relative mx-auto flex w-full max-w-4xl justify-center px-4 py-10">
        <FizziLogo />
        <div className="absolute right-24 -top-32">
          <CircularText text="*POP*THE*FLAVOR" spinDuration={20} />
        </div>
      </div>
    </footer>
  );
}