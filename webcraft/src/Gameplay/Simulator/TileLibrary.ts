import Grass from "../Tiles/Grass";
import BrickHouse from "../Tiles/BrickHouse";

const tileLibrary = {
    Grass,
    BrickHouse,
};

type TileLibrary = typeof tileLibrary;
type TileName = keyof TileLibrary;
type TileConstructor<T extends TileName> = InstanceType<TileLibrary[T]>;

export function createTile<T extends TileName>(
    params: { tilename: T } & ConstructorParameters<TileLibrary[T]>[0]
): TileConstructor<T> {
    const { tilename, ...rest } = params;
    const TileClass = tileLibrary[tilename];
    if(!TileClass)console.error(`❌⏹️ TILE "${tilename}" NOT FOUND!`);
    return new TileClass(rest) as TileConstructor<T>;
}
