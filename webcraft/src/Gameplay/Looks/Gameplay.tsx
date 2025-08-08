
"use client";

import { useGameData } from "./UpdateHook";
import { TileGrid } from "./TileGrid";
import { Toolbar } from "../Tools/Toolbar";
import { ItemList } from "../Items/ItemList";

export default function Gameplay() {
  const { GameData } = useGameData();

  if (GameData === null) return <div>Loading</div>;

  return (
    <>
      <ItemList />
      <TileGrid />
      <Toolbar />
    </>
  );
}
