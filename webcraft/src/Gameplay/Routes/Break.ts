
import { getSession } from "@/lib/Validator";
import { PlaySession } from "../Simulator/PlaySession";

export async function breakAt({tileId, tool}){
    const userId = (await getSession())?._id;
    if(!userId)return{ success:false, err:{server:"no session found!"}}
    
    const session = await PlaySession.getPlaySession(userId);
    const{success, tileData} = session.breakAt({tileId, tool});
    return{success, result: tileData};
}
