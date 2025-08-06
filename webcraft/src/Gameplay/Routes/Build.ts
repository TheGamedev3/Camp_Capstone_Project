
import { getSession } from "@/lib/Validator";
import { PlaySession } from "../Simulator/PlaySession";

export async function build({ what, tileId }){
    const userId = (await getSession())?._id;
    if(!userId)return{ success:false, err:{server:"no session found!"}}
    
    const session = await PlaySession.getPlaySession(userId);
    const{success, tileData} = session.placeAt({ what, tileId });
    return{success, result: tileData};
}
