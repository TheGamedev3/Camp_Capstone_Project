"use client";

import React, { useEffect, useCallback } from "react";
import { useTools } from "./ToolHook";
import { Tools } from "./Tools";
// import type { Tool } from "./ToolHook"; // if needed

function ToolTab({
  tool,
  sizePx,
  expandPx,
}: {
  tool: Tool;
  sizePx: number;
  expandPx: number;
}) {
  const { name, hoverName, icon: Icon, keybind } = tool;
  const { selectedTool, equipTool } = useTools();
  const isSelected = tool === selectedTool;

  /* ------------------- hot-key listener ------------------- */
  useEffect(() => {
    if (!keybind) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === keybind.toLowerCase()) equipTool(tool);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [keybind, tool, equipTool]);

  /* helper so we don’t re-create inline lambdas everywhere  */
  const onClick = useCallback(() => equipTool(tool), [equipTool, tool]);

  /* simple “pop-out” and colour change when selected        */
  return (
    <button
      title={hoverName ?? name}
      onClick={onClick}
      className={`
        group flex items-center justify-center mb-2 rounded-r-lg border transition-all
        ${isSelected ? "shadow-lg" : "hover:translate-x-0.5"}
        ${tool.borderColor ?? "border-gray-700"}
      `}
      style={{
        width: sizePx,                 // editable size
        height: sizePx,                // editable size
        transform: isSelected ? `translateX(${expandPx}px)` : undefined, // expand rightwards
      }}
    >
      <Icon
        className={isSelected ? tool.highlight ?? "text-blue-500" : "text-gray-400"}
        strokeWidth={isSelected ? 2.5 : 2}
        // lucide/react supports size prop
        size={Math.round(sizePx * 0.6)} // scale icon to button
      />
    </button>
  );
}

export function Toolbar({
  tabSizePx = 70,     // ← set this to your Slot size (e.g., ~70px) for visual match
  expandPx = 6,       // ← how far the selected tab “pops” to the right
}: {
  tabSizePx?: number;
  expandPx?: number;
}) {
  /* attached to the left edge with “pop-up” style tabs */
  return (
    <aside className="fixed left-0 top-1/3 flex flex-col pl-1" style={{zIndex:20}}>
      {Tools.map((tool) => (
        <ToolTab key={tool.name} tool={tool} sizePx={tabSizePx} expandPx={expandPx} />
      ))}
    </aside>
  );
}
