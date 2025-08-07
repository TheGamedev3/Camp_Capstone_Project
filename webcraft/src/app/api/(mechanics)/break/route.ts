
import { breakAt } from '@/Gameplay/Routes/Break';

export async function DELETE(req: Request) {return await breakAt(req)}
