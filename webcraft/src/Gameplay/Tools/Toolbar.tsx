

"use client";

import React, { useEffect } from 'react';
import { useTools } from './ToolHook';
import { Tools } from './Tools';

function ToolTab({ tool }: { tool: Tool }) {
  const {
    name,
    hoverName,
    icon: Icon,          // capital-ise so we can render <Icon />
    keybind,
  } = tool;

  const { selectedTool, equipTool } = useTools();
  const isSelected = tool === selectedTool;

  /* ------------------- hot-key listener ------------------- */
  useEffect(() => {
    if (!keybind) return;                      // skip if no shortcut

    const handle = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === keybind.toLowerCase()) {
        equipTool(tool);
      }
    };

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [keybind, tool, equipTool]);

  /* helper so we don’t re-create inline lambdas everywhere  */

  /* simple “pop-out” and colour change when selected        */
  return (
    <button
      title={hoverName ?? name}
      onClick={() => equipTool(tool)}
      className={`
        group flex items-center justify-center w-12 h-12 mb-2 rounded-r-lg border transition-all
        ${isSelected ? 'translate-x-1 shadow-lg' : 'hover:translate-x-0.5'}
        ${tool.borderColor ?? 'border-gray-700'}
      `}
    >
      <Icon
        className={isSelected ? tool.highlight ?? 'text-blue-500' : 'text-gray-400'}
        strokeWidth={isSelected ? 2.5 : 2}
      />
    </button>
  );
}

export function Toolbar() {
  /* attached to the left edge with “pop-up” style tabs */
  return (
    <aside className="fixed left-0 top-1/3 flex flex-col pl-1">
      {Tools.map(tool => (
        <ToolTab key={tool.name} tool={tool} />
      ))}
    </aside>
  );
}