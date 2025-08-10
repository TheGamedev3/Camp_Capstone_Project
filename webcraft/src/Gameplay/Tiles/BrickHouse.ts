
import { Structure } from "./Structure";

export default class BrickHouse extends Structure {
    layer: string = "structure";
    texture: string = "https://www.homestratosphere.com/wp-content/uploads/2018/07/red-brick-exterior-home2018-07-06-at-1.44.50-PM-12.jpg";

    swap: boolean = false;
    drops(){return`brick house (1)`}
    constructor(coords) {
        super(coords);
        const{ x, y }: { x: number; y: number } = coords;

        const cord1 = [x, y];
        const cord2 = [x+1, y+1];
        this.onTick(2, ()=>{
            this.swap = !this.swap;
            this.moveTo(...(this.swap ? cord1 : cord2));
        })
    }
}
