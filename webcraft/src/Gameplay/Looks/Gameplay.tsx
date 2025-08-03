

// have an inventory thingy nearby also

"use client"

import { useGameData } from "./UpdateHook"
import { TileGrid } from "./TileGrid"

export default function Gameplay(){
    const{ GameData } = useGameData();

    return(
        GameData === null
            ? <div>Loading</div>
            : <TileGrid/>
    );
}