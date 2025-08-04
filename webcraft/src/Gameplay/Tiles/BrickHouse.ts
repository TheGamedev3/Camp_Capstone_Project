
import { PlaySession } from "../Simulator/PlaySession";
import { TileBase } from "./TileBase";

export default class BrickHouse extends TileBase {
    layer: string = "structure";
    texture: string = "https://www.homestratosphere.com/wp-content/uploads/2018/07/red-brick-exterior-home2018-07-06-at-1.44.50-PM-12.jpg";

    swap: boolean = false;
    constructor({ x, y, session }: { x: number; y: number, session: PlaySession }) {
        super({ x, y, session });

        const cord1 = [x, y];
        const cord2 = [x+1, y+1];
        this.onTick(2, ()=>{
            this.swap = !this.swap;
            this.moveTo(...(this.swap ? cord1 : cord2));
        })
    }
}
