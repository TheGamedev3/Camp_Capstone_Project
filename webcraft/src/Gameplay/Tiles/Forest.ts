
import { PlaySession } from "../Simulator/PlaySession";
import { TileBase } from "./TileBase";
import { spawnStructure } from "../Routes/Build";

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default class Forest extends TileBase {
    layer: string = "structure";
    texture: string = "https://tse2.mm.bing.net/th/id/OIP.Gs0tJU3w2iFeE-zC63gh2gHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";

    constructor({ x, y, session }: { x: number; y: number, session: PlaySession }) {
        super({ x, y, session });

        this.onTick(1, () => {
            // every 1 tick, a 25% chance of spawning a tree in an available space
            if (Math.random() > 0.75) {
                const isSpaceValid = (tileId: string) => {
                    const stack = session?.tileBucket[tileId];
                    // space exists and has no structure on it
                    return !!stack && !stack.some(d => d.layer === "structure");
                };

                // cardinal directions
                const directions: Array<[number, number]> = [[1,0],[0,1],[-1,0],[0,-1]];
                const shuffled = shuffle(directions);

                for (const [dx, dy] of shuffled) {
                    const x2 = x + dx;           // <- add to your current tile coords
                    const y2 = y + dy;
                    const tileId = `${x2}-${y2}`;
                    if (isSpaceValid(tileId)) {
                        spawnStructure(session, { who: "server", what: "PineTree", tileId });
                        return; // done for this tick
                    }
                }
                // else: nothing happens this tick
            }
        });
    }
}
