
import Spawner from "./Spawner";
import { LootTable } from "./LootLogic";

export default class Mineshaft extends Spawner {
    layer: string = "structure";
    texture: string = "https://th.bing.com/th/id/R.02b16a23b74028b45938e1faa377bbc9?rik=PzRRvkfu%2bBODQw&riu=http%3a%2f%2fi.imgur.com%2fzPvdz.jpg&ehk=rEQ4U7SDvBUCwcBJSVJyCH6b3JH75DtSNJYqFrmOoKw%3d&risl=&pid=ImgRaw&r=0";
    
    // 25% chance per tick to spawn a Rock or Ore
    spawnChance: number = 0.25;
    spawnStructure: string | (() => string) = ()=>{
        return LootTable([
            ['Rock', 1],
            ['CoalOre', 2],
            ['MetalOre', 3]
        ]);
    };
    drops(){return`mineshaft (1)`;}

    health: number = 20;
    breakType: 'stone' | 'wood' | 'metal' = 'stone';
    constructor(coords){super(coords)}
}
