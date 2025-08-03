
import React from "react";
import { Tile } from "./Tile";

type Tile = {
  id: string;
  color: string;
};

import { useGameData } from "./UpdateHook"

export function TileGrid() {
  const{ GameData } = useGameData();

  const tiles: Tile[] = [];

  for (let y = 0; y < GameData.gridYSize; y++) {
    for (let x = 0; x < GameData.gridXSize; x++) {
      tiles.push({
        id: `${x}-${y}`,
        color: "#eee", // default tile color
      });
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className="grid gap-1 w-[min(90vw,500px)]"
        style={{
          gridTemplateColumns: `repeat(${GameData.gridXSize}, 1fr)`,
        }}
      >
        {tiles.map(({ id, color }) => (
          <Tile key={id} color={color} />
        ))}
      </div>
    </div>
  );
}
