import { TileBase } from "./TileBase";

export default class Grass extends TileBase {
    layer: string = 'floor';
    texture: string = "https://tse4.mm.bing.net/th/id/OIP.FbqH0HgUQPEISriPPbjhVgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    tileColor: string;

    constructor({ x, y }: { x: number; y: number }) {
        super({ x, y });

        // Checkerboard logic: alternate tint based on x + y
        const isEven = (x + y) % 2 === 0;

        this.tileColor = isEven ? "#ffffff" : "#858585ff"; // white vs light gray tint
    }
}
