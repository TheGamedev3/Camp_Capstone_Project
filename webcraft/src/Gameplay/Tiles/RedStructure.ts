
import { TileBase } from "./TileBase";

export default class RedStructure extends TileBase {
    layer: string = "structure";
    texture: string = "https://www.homestratosphere.com/wp-content/uploads/2018/07/red-brick-exterior-home2018-07-06-at-1.44.50-PM-12.jpg";

    constructor({ x, y }: { x: number; y: number }) {
        super({ x, y });
    }
}
