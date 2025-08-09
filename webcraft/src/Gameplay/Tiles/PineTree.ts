
import { PlaySession } from "../Simulator/PlaySession";
import { TileBase } from "./TileBase";

export default class PineTree extends TileBase {
    layer: string = "structure";
    texture: string = "https://m.media-amazon.com/images/I/61J5Ja5WQhL._AC_.jpg";
    drops(){
        // 2–4 wood
        const wood = Math.floor(Math.random() * (4 - 2 + 1)) + 2;
        let cones = 1;

        // small chance to get a second cone
        if(Math.random() > 0.8){cones = 2}
        
        return`wood (${wood}), pine cone (${cones})`;
    }
    constructor({ x, y, session }: { x: number; y: number, session: PlaySession }) {
        super({ x, y, session });
    }
}
