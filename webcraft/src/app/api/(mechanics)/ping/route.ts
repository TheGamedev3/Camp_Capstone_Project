
import { ping } from '@/Gameplay/Routes/Ping';

export async function GET(req: Request) {return await ping.req(req)}
