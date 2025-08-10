
import { PlaySession } from "../Simulator/PlaySession";
import { Structure } from "./Structure";
import { spawnStructure } from "../Routes/Build";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default class Spawner extends Structure {
    layer: string = "structure";

    spawnChance: number = 0.25;
    spawnStructure: string | (() => string) = '';

    constructor(coords) {
        super(coords);
        const{ x, y, session }: { x: number; y: number, session: PlaySession } = coords;

        this.onTick(1, () => {
            // every 1 tick, a spawnChance% chance of spawning a tree in an available space
            if (Math.random() >= (1-this.spawnChance)) {
                const isSpaceValid = (tileId: string) => {
                    const stack = session?.tileBucket[tileId];
                    // space exists and has no structure on it
                    return !!stack && !stack.some(d => d.layer === "structure");
                };

                // pick a random avaliable cardinal direction
                const directions: Array<[number, number]> = [[1,0],[0,1],[-1,0],[0,-1]];
                const shuffled = shuffle(directions);

                for (const [dx, dy] of shuffled) {
                    const x2 = x + dx;
                    const y2 = y + dy;
                    const tileId = `${x2}-${y2}`;
                    if (isSpaceValid(tileId)) {
                        let newStructure = '';
                        if (typeof this.spawnStructure === 'function') {
                            newStructure = this.spawnStructure();
                        } else {
                            newStructure = this.spawnStructure;
                        }
                        if(!newStructure)return;
                        spawnStructure(session, { who: "server", what: newStructure, tileId });
                        return; // done for this tick
                    }
                }
                // else: nothing happens this tick
            }
        });
    }
}
