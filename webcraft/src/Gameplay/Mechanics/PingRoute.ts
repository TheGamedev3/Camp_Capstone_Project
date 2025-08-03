

// x dimensions, y dimensions,
// get tile at(x, y)
// action("place", x, y)
// ping()
// render()
// fetch user schema world from mongoose

// Entire World/Player
// durabilityStorage[]
// autoDurability
// Equipped Tools
// Inventory
// Inventory Size

import { getSession } from "@/lib/Validator";
import { PlaySession } from "./PlaySession";

export async function ping(){
    const userId = (await getSession())?._id;
    if(!userId)return{ success:false, err:{server:"no session found!"}}
    
    const session = await PlaySession.getPlaySession(userId);
    session.ping();
    return{
        success: true,
        result: session.getData()
    }
}
