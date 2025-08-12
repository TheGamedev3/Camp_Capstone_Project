import Grass from "../Tiles/Grass";
import BrickHouse from "../Tiles/BrickHouse";
import CoalOre from "../Tiles/CoalOre";

import Forest from "../Tiles/Forest";
import Mountain from "../Tiles/Mountain";
import Mineshaft from "../Tiles/Mineshaft";

import Lumbermill from "../Tiles/Lumbermill";
import Drill from "../Tiles/Drill";

import MetalOre from "../Tiles/MetalOre";
import PineSappling from "./PineSappling";
import PineTree from "../Tiles/PineTree";
import Rock from "../Tiles/Rock";

import { Anvil } from "./Anvil";
import { BetaFurnace } from "./BetaFurnace";
import { Land } from "./Land";
import { ElectronicsStore } from "./ElectronicsStore";

const tileLibrary = {
  Grass,
  BrickHouse,
  PineSappling, PineTree,
  Rock, CoalOre, MetalOre,
  Forest, Mountain, Mineshaft,
  Lumbermill, Drill,
  Anvil, BetaFurnace, Land, ElectronicsStore
} as const;

type TileLibrary = typeof tileLibrary;
type TileName = keyof TileLibrary;

export function isTileName(name: string): name is TileName {
  return name in tileLibrary;
}

type TileConstructor<T extends TileName> = InstanceType<TileLibrary[T]>;

export function tilePreview<T extends TileName>(
    params: { name: T } & ConstructorParameters<TileLibrary[T]>[0]
): Record<string, any> {
    const { name } = params;
    const TileClass = tileLibrary[name];
    return JSON.parse(JSON.stringify((new TileClass(params) as TileConstructor<T>)));
}

export function createTile<T extends TileName>(
    params: { name: T } & ConstructorParameters<TileLibrary[T]>[0]
): TileConstructor<T> {
    const { name } = params;
    const TileClass = tileLibrary[name];
    return new TileClass(params) as TileConstructor<T>;
}
