
import { Structure } from "./Structure";
import { breakAt } from "../Routes/Break";

export default class Automaton extends Structure {
    layer: string = "structure";

    breakStructures: string | string[] = '';
    customDamage: number = 5;

    constructor(coords) {
        super(coords);
        const{ x, y, session, name }: { x: number; y: number, session: PlaySession, name: string } = coords;

        this.onTick(2, () => {
            // check for power later?
            const breakList = typeof this.breakStructures === 'string' ? [this.breakStructures] : this.breakStructures;
            const isSpaceValid = (tileId: string) => {
                const stack = session?.tileBucket[tileId];
                // space exists and has no structure on it
                return !!stack && stack.find(d => breakList.includes(d.name));
            };

            // pick a random avaliable cardinal direction
            const directions: Array<[number, number]> = [[1,0],[0,1],[-1,0],[0,-1]];

            for (const [dx, dy] of directions) {
                const x2 = x + dx;
                const y2 = y + dy;
                const tileId = `${x2}-${y2}`;
                if (isSpaceValid(tileId)) {
                    breakAt(session, { customDamage: this.customDamage, tileId });
                    return; // done for this tick
                }
            }
            // else: nothing happens this tick
        });
    }
}
