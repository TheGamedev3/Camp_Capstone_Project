
import React from "react";
import { Tile } from "./Tile";

type Tile = {
  id: string;
  color: string;
};

export default function TileGrid() {
  const gridSize = 3;
  const tiles: Tile[] = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      tiles.push({
        id: `${x}-${y}`,
        color: "#eee", // default tile color
      });
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="grid grid-cols-3 gap-2">
        {tiles.map(({id, color}) => (<Tile key={id} color={color}/>))}
      </div>
    </div>
  );
}
