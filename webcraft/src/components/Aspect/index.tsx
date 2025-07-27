// hooks/usePageLayout.ts
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type PageLayoutCtx = {
  fullWidth: boolean;
  setFullWidth: (v: boolean) => void;
};

const PageLayoutContext = createContext<PageLayoutCtx | null>(null);

const defaultSize = false;

export function Aspect({ children }: { children: React.ReactNode }) {
  const [fullWidth, setFullWidth] = useState(defaultSize);
  return (
    <div className={fullWidth ? "" : "max-w-5xl mx-auto p-4"}>
        <PageLayoutContext.Provider value={{ fullWidth, setFullWidth }}>
            {children}
        </PageLayoutContext.Provider>
    </div>
  );
}

export const useSetAspect = (size:boolean) => {
  const ctx = useContext(PageLayoutContext);
  if (!ctx) throw new Error("usePageLayout must be used inside PageLayoutProvider");

  useEffect(()=>{
    ctx.setFullWidth(size);
    ()=>ctx.setFullWidth(defaultSize); // on exit, restore defaults
  },[size]);
};