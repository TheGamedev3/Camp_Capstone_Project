import React, { CSSProperties, useMemo } from "react";
import { useTile } from "./UpdateHook";
import { useTools } from "../Tools/ToolHook";
import Image from "next/image";

/* ----------  Types ----------------------------------------------------- */

type TileDatum = {
  layer: "floor" | "structure" | string;
  tileColor?: string;   // e.g. "#aabbcc"
  texture?: string;     // URL
};

type TileProps = { id: string };

/* ----------  Helpers --------------------------------------------------- */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!match) return null;
  const int = parseInt(match[1], 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function blendColors(colors: string[]): string {
  if (colors.length === 0) return "#CCCCCC";
  const sum = colors
    .map(hexToRgb)
    .filter(Boolean)
    .reduce(
      (acc, rgb) => ({
        r: acc.r + (rgb as any).r,
        g: acc.g + (rgb as any).g,
        b: acc.b + (rgb as any).b,
      }),
      { r: 0, g: 0, b: 0 }
    );
  const len = colors.length;
  return rgbToHex({
    r: Math.round(sum.r / len),
    g: Math.round(sum.g / len),
    b: Math.round(sum.b / len),
  });
}

/* ----------  Component ------------------------------------------------- */

export const Tile = React.memo(function Tile({ id }: TileProps) {
  const myTileStack = useTile(id) as TileDatum[] | null;
  const { selectedTile, selectedTool, setHover, selectedHighlight, fireActivate } = useTools();

  /* --------  Derived display data  ------------------------------------ */
  const { bgColor, bgTexture, structures } = useMemo(() => {
    const floorData = (myTileStack ?? []).filter(d => d.layer === "floor");
    const structureData = (myTileStack ?? []).filter(
      d => d.layer === "structure" && d.texture
    );

    const bgColor = blendColors(floorData.map(d => d.tileColor ?? "#FFFFFF"));
    const bgTexture = floorData.find(d => d.texture)?.texture ?? undefined;

    return {
      bgColor,
      bgTexture,
      structures: structureData as Array<
        Required<Pick<TileDatum, "texture">> &
        Partial<Pick<TileDatum, "name" | "currentHealth" | "health">>
      >,
    };
  }, [myTileStack]);

  /* pick the top-most structure (if multiple stacked) */
  const topStruct = structures.at(-1);
  const sName = topStruct?.name ?? "";
  const hp     = (topStruct?.currentHealth) as number | undefined;
  const hpMax  = (topStruct?.health) as number | undefined;

  const showHover = selectedTile === id && !!selectedHighlight;
  const showHpBar = showHover && hpMax !== undefined && hp !== undefined && hp !== hpMax;

  /* --------  Styles  --------------------------------------------------- */
  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: "10%",
    objectFit: "contain",
    width: "80%",
    height: "80%",
    pointerEvents: "none",
  };

  const highlightOverlay: CSSProperties = {
    backgroundColor: selectedTile === id && selectedHighlight ? selectedHighlight : "transparent",
    position: "absolute",
    inset: 0,
    zIndex: 5,
    pointerEvents: "none",
  };

  /* --------  Handlers  ------------------------------------------------- */
  const handleMouseEnter = () => setHover(id);
  const handleMouseLeave = () => { if (selectedTile === id) setHover(null); };
  const handleClick = () => { if (selectedTile === id) fireActivate(id); };

  /* --------  Render  --------------------------------------------------- */
  return (
    <div className="aspect-square relative">
      <div className="w-full h-full rounded-sm overflow-hidden relative z-0">
        {/* base color */}
        <div style={{ backgroundColor: bgColor, position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        {/* floor texture */}
        {bgTexture && (
          <div
            style={{
              backgroundImage: `url(${bgTexture})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.9,
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}

        <div style={highlightOverlay} />

        {/* structures */}
        {structures.map((s, idx) => (
          <img
            key={idx}
            src={s.texture}
            alt=""
            style={{ ...overlayStyle, zIndex: 6 }}
          />
        ))}

        {/* Hover UI: name + (if damaged) HP bar */}
        {showHover && topStruct && (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-1 z-8 flex flex-col items-center gap-1">
            {/* name tag */}
            {sName && (
              <div className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-black/70 text-white">
                {sName}
              </div>
            )}
            {/* hp bar only if not at max */}
            {showHpBar && (
              <div className="flex flex-col items-center gap-0.5">
                {/* bar */}
                <div className="h-1 w-16 rounded bg-black/50 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{
                      width: `${Math.max(0, Math.min(100, (hp! / hpMax!) * 100))}%`,
                    }}
                  />
                </div>
                {/* hp numbers */}
                <span className="text-[10px] font-semibold text-white drop-shadow">
                  {hp} / {hpMax}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hitbox layer */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ position: "absolute", inset: "-2px", zIndex: 10, backgroundColor: "transparent", pointerEvents: "auto" }}
      />
    </div>
  );
});

