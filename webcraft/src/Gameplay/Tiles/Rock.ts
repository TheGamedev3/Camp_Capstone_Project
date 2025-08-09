
import { PlaySession } from "../Simulator/PlaySession";
import { TileBase } from "./TileBase";

export default class Rock extends TileBase {
    layer: string = "structure";
    texture: string = "https://tse2.mm.bing.net/th/id/OIP.b4deD6cJ1f3bkB4mtzAjuAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    drops(){
        // 2–4 stone
        const stone = Math.floor(Math.random() * (4 - 2 + 1)) + 2;
        return`stone (${stone})`;
    }
    constructor({ x, y, session }: { x: number; y: number, session: PlaySession }) {
        super({ x, y, session });
    }
}
