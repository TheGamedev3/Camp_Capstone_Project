
// *imported at app/api/first/route.ts

import { onConnect } from "@MongooseSys";

let started = false;
export async function StartServer(){
    if(started)return; started=true;
    await onConnect();
    console.log('🎩 hosted at: http://localhost:3000')
}


