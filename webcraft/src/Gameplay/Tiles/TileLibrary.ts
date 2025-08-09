import Grass from "../Tiles/Grass";
import BrickHouse from "../Tiles/BrickHouse";
import CoalOre from "../Tiles/CoalOre";
import Forest from "../Tiles/Forest";
import MetalOre from "../Tiles/MetalOre";
import PineTree from "../Tiles/PineTree";
import Rock from "../Tiles/Rock";

const tileLibrary = {
  Grass,
  BrickHouse,
  CoalOre,
  Forest,
  MetalOre,
  PineTree,
  Rock,
} as const;

type TileLibrary = typeof tileLibrary;
type TileName = keyof TileLibrary;

export function isTileName(name: string): name is TileName {
  return name in tileLibrary;
}

type TileConstructor<T extends TileName> = InstanceType<TileLibrary[T]>;

export function tilePreview<T extends TileName>(
    params: { tilename: T } & ConstructorParameters<TileLibrary[T]>[0]
): Record<string, any> {
    const { tilename, ...rest } = params;
    const TileClass = tileLibrary[tilename];
    return JSON.parse(JSON.stringify((new TileClass(rest) as TileConstructor<T>)));
}

export function createTile<T extends TileName>(
    params: { tilename: T } & ConstructorParameters<TileLibrary[T]>[0]
): TileConstructor<T> {
    const { tilename, ...rest } = params;
    const TileClass = tileLibrary[tilename];
    return new TileClass(rest) as TileConstructor<T>;
}
