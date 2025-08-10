
import Automaton from "./Automaton";

export default class Drill extends Automaton {
    layer: string = "structure";
    texture: string = "https://th.bing.com/th/id/R.2d733f8a457e3863529293f0503bd5e9?rik=AFEdiOlIJHzFRw&pid=ImgRaw&r=0";
    
    breakStructures: string | string[] = ['Rock', 'CoalOre', 'MetalOre'];
    drops(){return`drill (1)`;}

    constructor(coords){super(coords)}
}
