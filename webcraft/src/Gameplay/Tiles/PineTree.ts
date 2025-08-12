
import { Structure } from "./Structure";

export default class PineTree extends Structure {
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

    health: number = 5;
    breakType: 'stone' | 'wood' | 'metal' = 'wood';
    constructor(coords){super(coords)}
}
