
import { getSession } from "@/lib/Validator";
import { PlaySession } from "../Simulator/PlaySession";

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
