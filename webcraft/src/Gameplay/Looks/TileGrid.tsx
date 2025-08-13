
import React from "react";
import { Tile } from "./Tile";

type Tile = {
  id: string;
  color: string;
};

import { useGameData } from "./UpdateHook"

export function TileGrid() {
  const{ ClientData } = useGameData();

  const tiles: Tile[] = [];

  for (let y = 0; y < ClientData.gridYSize; y++) {
    for (let x = 0; x < ClientData.gridXSize; x++) {
      tiles.push({ id: `${x}-${y}` });
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className="grid gap-1 w-[min(90vw,500px)]"
        style={{
          gridTemplateColumns: `repeat(${ClientData.gridXSize}, 1fr)`,
        }}
      >
        {tiles.map(({ id }) => (
          <Tile key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
