
import { PlaySession } from "../Simulator/PlaySession";
import { TileBase } from "./TileBase";

export default class CoalOre extends TileBase {
    layer: string = "structure";
    texture: string = "https://png.pngtree.com/png-vector/20241024/ourlarge/pngtree-3d-natural-coal-ore-isolated-on-transparent-background-closeup-png-image_14137347.png";
    drops(){
        // 1–3 coal
        const coal = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        return`coal (${coal})`;
    }
    constructor({ x, y, session }: { x: number; y: number, session: PlaySession }) {
        super({ x, y, session });
    }
}
