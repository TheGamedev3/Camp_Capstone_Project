
"use client";

import { useGameData } from "./UpdateHook";
import { TileGrid } from "./TileGrid";
import { Toolbar } from "../Tools/Toolbar";
import { ItemList } from "../Items/ItemList";
import Menu from "../Recipes/Menu";
import ItemNotif from "../Items/ItemNotif";

export default function Gameplay() {
  const { ClientData } = useGameData();
  if (ClientData === null) return <div>Loading</div>;

  return (
    <div className="h-screen flex flex-col gap-2 p-2">
      {/* TileGrid grows to fill leftover height */}
      <TileGrid />

      {/* ItemList + Toolbar sit below; keep their own fixed/auto heights */}
      <ItemList />
      <ItemNotif/>
      <Toolbar />
      <Menu/>
    </div>
  );
}
