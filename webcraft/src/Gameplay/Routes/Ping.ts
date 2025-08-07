
import { UnderSession } from "./UponSession";

export const ping = UnderSession((session)=>{
    session.ping();
    return{
        success: true,
        result: session.getData()
    }
});
