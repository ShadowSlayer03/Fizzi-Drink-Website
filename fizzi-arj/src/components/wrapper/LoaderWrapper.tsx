"use client";

import { useState, useEffect } from "react";
import SodaLoader from "../SodaLoader";

export default function LoaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 14000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SodaLoader />;
  }

  return <>{children}</>;
}
