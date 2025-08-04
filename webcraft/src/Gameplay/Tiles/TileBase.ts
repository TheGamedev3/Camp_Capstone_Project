
export class TileBase {
    x: number; y: number;
    key: string;

    layer?: string = 'structure';
    texture?: string;
    tileColor?: string;

    constructor({ x, y }: { x: number; y: number }) {
        this.x = x; this.y = y;
        this.key = `${x}-${y}`;
    }
}
