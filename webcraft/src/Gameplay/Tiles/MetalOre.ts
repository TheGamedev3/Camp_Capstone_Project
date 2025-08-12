
import { Structure } from "./Structure";

export default class MetalOre extends Structure {
    layer: string = "structure";
    texture: string = "https://1.bp.blogspot.com/-t7a4HzPEUa0/WH948JIm90I/AAAAAAAAEZI/ofFODClpqx0aCQ5TyGc_Q1bRg0YSe83sgCLcB/s1600/iron.png";
    drops(){
        // 1–2 metal ore
        const ore = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
        return`metal ore (${ore})`;
    }

    health: number = 10;
    breakType: 'stone' | 'wood' | 'metal' = 'stone';
    constructor(coords){super(coords)}
}
