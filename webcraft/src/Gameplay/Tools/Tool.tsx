

"use client";


/* ------------------------------------------------------------------ */
/*  CLASS                                                              */
/* ------------------------------------------------------------------ */

export class Tool {
  name: string;
  hoverName: string;
  highlight?: string;
  borderColor?: string;
  keybind?: string;
  icon: React.ComponentType<any>;
  defaultTool: boolean;

  private _unhover: (tileId: string | null) => void;
  private _hoveringTile: string | null = null;

  constructor({
    name,
    hoverName,
    highlight,
    borderColor,
    keybind,
    icon = () => null,     /* fallback empty icon */
    defaultTool = false,
    onHover,
    onAction,
    onEquip,
    onUnequip,
  }: {
    name: string;
    hoverName?: string;
    highlight?: string;
    borderColor?: string;
    keybind?: string;
    icon?: React.ComponentType<any>;
    defaultTool?: boolean;

    onHover?: (tileId: string | null) => void | ((tileId: string | null) => void);
    onAction?: (tileId: string) => void;
    onEquip?: () => void;
    onUnequip?: () => void;
  }) {
    this.name = name;
    this.hoverName = hoverName ?? name;
    this.highlight = highlight;
    this.borderColor = borderColor;
    this.keybind = keybind;
    this.icon = icon;
    this.defaultTool = defaultTool;

    this.hover = (tileId: string | null) => {
        if(onHover && _hoveringTile !== tileId){
            if(this._unhover){this._unhover(this._hoveringTile)} // (call the unhover for previous)
            this._hoveringTile = _tileId;
            this._unhover = onHover();
        }
    }
    this.action = onAction ?? ((tileId: string) => {});
    this.equip = onEquip ?? (() => {});
    this.unequip = onUnequip ?? (() => {});
  }

}







import React, { useEffect } from 'react';
import { useTools } from './ToolHook';

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

import { Info, Hammer, X } from 'lucide-react';

export const Tools: Tool[] = [
  new Tool({
    name: 'interact',
    keybind: 'e',
    icon: Info,
    defaultTool: true,
    highlight: 'rgba(255, 255, 255, 0.7)', // light translucent white
  }),
  new Tool({
    name: 'build',
    keybind: 't',
    icon: Hammer,
    borderColor: 'border-blue-500',
    highlight: 'rgba(59, 130, 246, 0.7)', // Tailwind blue-500 at 40% opacity
  }),
  new Tool({
    name: 'break',
    keybind: 'b',
    icon: X,
    borderColor: 'border-red-500',
    highlight: 'rgba(239, 68, 68, 0.7)', // Tailwind red-500 at 40% opacity
  }),
];


export const defaultTool = Tools.find(t => t.defaultTool) ?? Tools[0];

/* ------------------------------------------------------------------ */
/*  COMPONENTS                                                         */
/* ------------------------------------------------------------------ */

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

export function ToolBar() {
  /* attached to the left edge with “pop-up” style tabs */
  return (
    <aside className="fixed left-0 top-1/3 flex flex-col pl-1">
      {Tools.map(tool => (
        <ToolTab key={tool.name} tool={tool} />
      ))}
    </aside>
  );
}