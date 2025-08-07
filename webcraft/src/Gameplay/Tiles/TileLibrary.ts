import Grass from "../Tiles/Grass";
import BrickHouse from "../Tiles/BrickHouse";

const tileLibrary = {
  Grass,
  BrickHouse,
} as const;

type TileLibrary = typeof tileLibrary;
type TileName = keyof TileLibrary;

export function isTileName(name: string): name is TileName {
  return name in tileLibrary;
}

type TileConstructor<T extends TileName> = InstanceType<TileLibrary[T]>;

export function createTile<T extends TileName>(
    params: { tilename: T } & ConstructorParameters<TileLibrary[T]>[0]
): TileConstructor<T> {
    const { tilename, ...rest } = params;
    const TileClass = tileLibrary[tilename];
    return new TileClass(rest) as TileConstructor<T>;
}
