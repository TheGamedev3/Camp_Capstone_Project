
import Spawner from "./Spawner";

export default class Forest extends Spawner {
    layer: string = "structure";
    texture: string = "https://tse2.mm.bing.net/th/id/OIP.Gs0tJU3w2iFeE-zC63gh2gHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    
    // 25% chance per tick to spawn a Pine Tree
    spawnChance: number = 0.25;
    spawnStructure: string | (() => string) = 'PineTree';
    drops(){return`forest (1)`;}

    health: number = 20;
    breakType: 'stone' | 'wood' | 'metal' = 'wood';
    constructor(coords){super(coords)}
}
