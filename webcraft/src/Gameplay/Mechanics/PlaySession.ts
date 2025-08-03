

const playSessionCache: Record<string, PlaySession> = {};

const exposedProperties = [
    'userId',
    'gridXSize', 'gridYSize'
] as const;

// inferred: "userId" | "gridXSize" | "gridYSize" ....
type ExposedKeys = typeof exposedProperties[number];


export class PlaySession{

    userId: string;
    gridXSize: number; gridYSize: number;

    inactivity: NodeJS.Timeout | null = null;

    constructor(props: { userId: string; gridXSize: number; gridYSize: number }) {
        this.userId = props.userId;
        this.gridXSize = props.gridXSize;
        this.gridYSize = props.gridYSize;
    }

    ping(){
        if(this.inactivity){
            clearTimeout(this.inactivity);
            this.inactivity = null;
        }else{
            console.log(`🏁 STARTED PLAY SESSION: ${this.userId}`);
            // run on start here
        }

        // in 10 seconds of inactivity or lack of response from the client, delete self
        this.inactivity = setTimeout(()=>{
            // save on deletion

            delete playSessionCache[this.userId];
            console.log(`❌🏁 REMOVED PLAY SESSION: ${this.userId}`);
        },10000);

        // run process ticks here

        // occasionally auto save
    }

    // expose only certain properties
    getData(): Pick<PlaySession, ExposedKeys> {
        return Object.fromEntries(
            exposedProperties.map((key) => [key, this[key]])
        ) as Pick<PlaySession, ExposedKeys>;
    }

    static async getPlaySession(userId: string){
        const found = playSessionCache[userId];
        if(found)return found;

        // fetch user mongoose data to get the tile data here later...

        const newCache = new PlaySession({
            userId, gridXSize: 6, gridYSize: 6
        });
        playSessionCache[userId] = newCache;
        return newCache;
    }
}
