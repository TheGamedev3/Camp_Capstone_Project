
import { build } from '@/Gameplay/Routes/Build';

export async function POST(req: Request) {return await build(req)}
