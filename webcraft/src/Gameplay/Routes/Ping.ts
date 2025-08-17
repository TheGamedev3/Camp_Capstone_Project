
import { ReqFit } from "./ReqFit";

export const ping = ReqFit(({session})=>{
    session.ping();
    return{
        success: true,
        result: session.getData()
    }
});
