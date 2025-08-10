
import { TileBase } from "./TileBase";

export class Structure extends TileBase {
    layer: string = "structure";
    
    health: number = 5;
    breakType: 'stone' | 'wood' | 'metal' = 'wood';
    currentHealth?: number;
    
    constructor(coords){super(coords)}
}
