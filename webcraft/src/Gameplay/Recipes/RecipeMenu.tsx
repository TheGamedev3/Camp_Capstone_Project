// RecipeMenu.tsx
"use client";

import { useEffect } from "react";
import { useMenu } from "./MenuHook";
import { useTools } from "../Tools/ToolHook";
import { Tools } from "../Tools/Tools";
import { Recipe } from "./Recipe";

/** Flexible preview type — tolerant while MenuHook stabilizes */
type RecipePreview = {
  recipeId?: string;
  outputURL?: string;
  outputProfile?: string; // if you add it later
  outputCount?: number;
  totalCost?: [unknown, number][]; // e.g., [[{name:'metal'},3], ...]
};

export function Menu() {
  const { menu, setMenu } = useMenu();
  const { equipTool } = useTools();

  const isOpen = !!menu;
  const isLoading = !!menu?.sendRequest;

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") equipTool(Tools[3]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setMenu]);

  if (!isOpen) return null;

  // Be forgiving: accept array or single object
  const raw = (menu as any)?.recipies;
  const rows: RecipePreview[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={() => {if(isOpen)equipTool(Tools[3])}}
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* shell */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[960px] max-w-[95vw] h-[600px] max-h-[90vh]
                   rounded-2xl bg-neutral-900 text-neutral-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/60">
          <div className="text-lg font-semibold">
            {menu?.header ?? menu?.tableType ?? "Recipes"}
          </div>
          <button
            onClick={() => setMenu(null)}
            className="px-2 py-1 rounded hover:bg-neutral-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* body: 2 columns */}
        <div className="grid grid-cols-2 h-[calc(100%-48px)]">
          {/* left placeholder panel (empty for now) */}
          <div className="border-r border-neutral-800 p-3 overflow-auto">
            <div className="h-full rounded-lg border border-neutral-800/70 bg-neutral-950/30 flex items-center justify-center text-sm text-neutral-500">
              inventory panel (todo)
            </div>
          </div>

          {/* right: recipe list */}
          <div className="p-3 overflow-auto">
            {isLoading && (
              <div className="text-sm text-neutral-400">Loading recipes…</div>
            )}

            {!isLoading && rows.length === 0 && (
              <div className="text-sm text-neutral-400">No recipes.</div>
            )}

            {!isLoading && rows.length > 0 && (
              <div className="flex flex-col gap-3">
                {rows.map((r, idx) => <Recipe key={r.recipeId ?? idx} {...r}/>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;
