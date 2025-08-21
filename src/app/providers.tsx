"use client";

import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@/tests/mocks/browser").then(({ worker }) => {
        worker.start();
      });
    }
  }, []);

  return <>{children}</>;
}