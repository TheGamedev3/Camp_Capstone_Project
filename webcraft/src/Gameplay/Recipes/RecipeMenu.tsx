// RecipeMenu.tsx
"use client";

import { Recipe } from "./Recipe";
import InventoryPanel from "./InventoryPanel";

/** Flexible preview type — tolerant while MenuHook stabilizes */
type RecipePreview = {
  recipeId?: string;
  outputURL?: string;
  outputProfile?: string; // if you add it later
  outputCount?: number;
  totalCost?: [unknown, number][]; // e.g., [[{name:'metal'},3], ...]
};

export function RecipeMenu({menu, isLoading, closeFunc}) {

  const raw = (menu as any)?.recipies;
  const rows: RecipePreview[] = Array.isArray(raw) ? raw : raw ? [raw] : [];

  return (
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
            onClick={closeFunc}
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
            <InventoryPanel/>
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
  );
}
