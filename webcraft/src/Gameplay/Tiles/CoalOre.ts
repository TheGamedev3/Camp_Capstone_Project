
import { Structure } from "./Structure";

export default class CoalOre extends Structure {
    layer: string = "structure";
    texture: string = "https://png.pngtree.com/png-vector/20241024/ourlarge/pngtree-3d-natural-coal-ore-isolated-on-transparent-background-closeup-png-image_14137347.png";
    drops(){
        // 1–3 coal
        const coal = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        return`coal (${coal})`;
    }

    health: number = 7;
    breakType: 'stone' | 'wood' | 'metal' = 'stone';
    constructor(coords){super(coords)}
}
