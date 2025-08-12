// RecipeMenu.tsx
"use client";

import { useCallback, useEffect } from "react";
import { useMenu } from "./MenuHook";
import { useTools } from "../Tools/ToolHook";
import { Tools } from "../Tools/Tools";

import { RecipeMenu } from "./RecipeMenu";

export function Menu() {
  const { menu, setMenu } = useMenu();
  const { equipTool } = useTools();

  const isOpen = !!menu;
  const isLoading = !!menu?.sendRequest;

  const closeFunc = useCallback(()=>{
    equipTool(Tools[3]);
  },[equipTool]);

  // Esc to close & unequip
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFunc();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setMenu]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={() => {if(isOpen)closeFunc()}} // unequip on clicking offscreen
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60"/>
      {
        menu.menuType === 'recipes' && <RecipeMenu menu={menu} isLoading={isLoading} closeFunc={closeFunc}/>
      }
    </div>
  );
}

export default Menu;
