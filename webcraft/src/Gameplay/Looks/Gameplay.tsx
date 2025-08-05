
"use client";

import { useGameData } from "./UpdateHook";
import { TileGrid } from "./TileGrid";
import { ToolBar } from "../Tools/Tool";

export default function Gameplay() {
  const { GameData } = useGameData();

  if (GameData === null) return <div>Loading</div>;

  return (
    <>
      <TileGrid />
      <ToolBar />
    </>
  );
}
