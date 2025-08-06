

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
  private _actionable: boolean = true;

  constructor({
    name,
    hoverName,
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
    borderColor?: string;
    keybind?: string;
    icon?: React.ComponentType<any>;
    defaultTool?: boolean;

    onHover?: (tileId: string | null, tileStack: any[]) => any;
    onAction?: (tileId: string, tileStack: any[]) => Promise<any> | any;
    onEquip?: () => void;
    onUnequip?: () => void;
  }) {
    this.name = name;
    this.hoverName = hoverName ?? name;
    this.borderColor = borderColor;
    this.keybind = keybind;
    this.icon = icon;
    this.defaultTool = defaultTool;

    this.hover = (tileId: string | null, tileStack: any[]) => {
        if(onHover){
            if(this._unhover && this._hoveringTile !== tileId){this._unhover(this._hoveringTile)} // (call the unhover for previous tile)
            this._hoveringTile = tileId;
            const hoverResult = onHover(tileId, tileStack);
            this._unhover = hoverResult?.onUnhover;
            this._actionable = (hoverResult?.actionable !== false && hoverResult?.actionable !== null);
            return hoverResult;
        }
    }
    this.action = async(tileId: string, tileStack: any[])=>{if(this._actionable)return await onAction?.(tileId, tileStack)} ?? ((tileId: string) => {});
    this.equip = onEquip ?? (() => {});
    this.unequip = onUnequip ?? (() => {});
  }

}







import React, { useEffect } from 'react';
import { useTools } from './ToolHook';
import { getRoute } from '@/utils/request';

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
    onHover(tileId: string | null, tileStack: any[]){
        if(tileId === null)return{actionable: false}
        const interactable = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        return{
            actionable: interactable,
            highlight: interactable ? 'rgba(255, 255, 255, 0.7)' : null,
        }
    }
  }),
  new Tool({
    name: 'build',
    keybind: 't',
    icon: Hammer,
    borderColor: 'border-blue-500',
    onHover(tileId: string, tileStack: any[]){
        if(tileId === null)return{actionable: false}
        const collision = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        return{
            actionable: !collision,
            highlight: !collision ? 'rgba(0, 255, 34, 0.7)' : 'rgba(136, 0, 0, 0.7)',
            hoverTile: {structure: "BrickHouse"} // (w/ a default transparency of 40)
        }
    },

    async onAction(tileId: string, tileStack: any[]){
        const collision = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        if(collision){return}

        const tileUpdate = await getRoute({route: "POST /api/build", body: {what: "BrickHouse", tileId}});
        return{tileUpdate};
    }
  }),
  new Tool({
    name: 'break',
    keybind: 'b',
    icon: X,
    borderColor: 'border-red-500',
    onHover(tileId: string, tileStack: any[]){
        if(tileId === null)return{actionable: false}
        const breakTarget = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        return{
            actionable: breakTarget,
            highlight: breakTarget ? 'rgba(239, 68, 68, 0.7)' : null
        }
    },

    async onAction(tileId: string, tileStack: any[]){
        const breakTarget = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        if(!breakTarget){return}

        const tileUpdate = await getRoute({route: "DELETE /api/break", body: {tileId, tool: "wooden_axe"}});
        return{tileUpdate};
    }
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