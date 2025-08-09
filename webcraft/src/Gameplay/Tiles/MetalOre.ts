
import { PlaySession } from "../Simulator/PlaySession";
import { TileBase } from "./TileBase";

export default class MetalOre extends TileBase {
    layer: string = "structure";
    texture: string = "https://1.bp.blogspot.com/-t7a4HzPEUa0/WH948JIm90I/AAAAAAAAEZI/ofFODClpqx0aCQ5TyGc_Q1bRg0YSe83sgCLcB/s1600/iron.png";
    drops(){
        // 1–2 metal ore
        const ore = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        return`metal ore (${ore})`;
    }
    constructor({ x, y, session }: { x: number; y: number, session: PlaySession }) {
        super({ x, y, session });
    }
}
