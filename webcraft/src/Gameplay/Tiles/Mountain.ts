
import Spawner from "./Spawner";
import { LootTable } from "./LootLogic";

export default class Mountain extends Spawner {
    layer: string = "structure";
    texture: string = "https://th.bing.com/th/id/R.a4135f38639d7f8c71d08731c6225ec2?rik=wGokmSuSKxk%2fOQ&pid=ImgRaw&r=0";
    
    // 25% chance per tick to spawn a Rock or Ore
    spawnChance: number = 0.25;
    spawnStructure: string | (() => string) = ()=>{
        return LootTable([
            ['Rock', 5],
            ['CoalOre', 2],
            ['MetalOre', 1]
        ]);
    };
    drops(){return`mountain (1)`;}

    constructor(coords){super(coords)}
}
