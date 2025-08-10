
import Automaton from "./Automaton";

export default class Lumbermill extends Automaton {
    layer: string = "structure";
    texture: string = "https://tse2.mm.bing.net/th/id/OIP.rXHMZ6ZqHWNqSnfXQwhcywHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    
    breakStructures: string | string[] = ['PineTree'];
    drops(){return`lumber mill (1)`;}

    constructor(coords){super(coords)}
}
