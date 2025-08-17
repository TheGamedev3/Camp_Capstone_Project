
import { Structure } from "./Structure";
import { spawnStructure } from "../Routes/Build";

export default class PineSappling extends Structure {
    layer: string = "structure";

    texture: string = "https://tse3.mm.bing.net/th/id/OIP.fA9WGhef-Lb3HOG6Uh_bTgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    drops(): string {return"pine cone"}

    health: number = 5;
    breakType: 'stone' | 'wood' | 'metal' = 'wood';
    constructor(coords) {
        super(coords);
        const{ x, y, session }: { x: number; y: number, session: PlaySession, name: string } = coords;

        // every one tick, it has a 25% to grow up
        this.onTick(1, async() => {
            if(Math.random() > 0.75 && this.removeSelf()){
                spawnStructure({session, what:"PineTree", x, y});
            }
        });
    }
}
