import type { PlaySession } from "../Simulator/PlaySession";

export class TileBase {
    x: number; y: number;
    key: string;

    name: string;
    layer?: string = 'structure';
    texture?: string;
    tileColor?: string;
    drops(): string {return ''}

    private myListeners: (() => void)[] = [];
    private session: PlaySession;

    constructor({ x, y, session, name }: { x: number; y: number, session: PlaySession, name: string }) {
        this.x = x; this.y = y;
        this.key = `${x}-${y}`;
        this.name = name;
        
        Object.defineProperty(this, "session", {
            value: session,
            enumerable: false,
            writable: true,
        });
    }

    onTick(range: number, func: () => void) {
        if(!this.session)return;

        this.myListeners.push(func);
        let count = 0;

        const onEvery = () => {
            count++;
            if (count >= range) {
                count = 0;
                func();
            }
        };

        this.session.pingListeners.push(onEvery);
        
        // (track the wrapped version for removal)
        this.myListeners.push(onEvery);
    }

    deleteSelf(){
        if(!this.session)return false;
        if(!this.removeSelf())return false;
        this.myListeners.forEach(listener => {
            const index = this.session.pingListeners.indexOf(listener);
            if (index !== -1) {
                this.session.pingListeners.splice(index, 1);
            }
        });
        this.myListeners = [];
        this.session.changed();
        return true;
    }

    // %! IRR(242) CREATE A DROP FUNCTION
    dropSelf(){
        if(!this.session || !this.deleteSelf())return;
        return this.drops();
    }

    moveTo(newX: number, newY: number){
        if(!this.session){return}
        if(!this.removeSelf())return;

        this.x = newX; this.y = newY;
        this.key = `${newX}-${newY}`;
        (this.session.tileBucket[this.key]??=[]).push(this);
    }

    removeSelf(){
        if(!this.session)return false;
        const arr = this.session.tileBucket[this.key];
        if (!arr) return false;
        const index = arr.indexOf(this);
        if (index !== -1) {
            arr.splice(index, 1);
            return true;
        }
        return false
    }

}
