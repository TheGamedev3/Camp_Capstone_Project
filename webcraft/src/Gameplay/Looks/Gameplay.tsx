
"use client";

import { useGameData } from "./UpdateHook";
import { TileGrid } from "./TileGrid";
import { Toolbar } from "../Tools/Toolbar";

export default function Gameplay() {
  const { GameData } = useGameData();

  if (GameData === null) return <div>Loading</div>;

  return (
    <>
      <TileGrid />
      <Toolbar />
    </>
  );
}
