
import {User} from '../DB_Objects/User';

export interface DummyPlayer {
  username: string;
  email: string;
  password: string;
  profile?: string;
}

export async function seedDummyPlayers(players: DummyPlayer[]) {
    console.log("🌱 Seeding Database Data...");
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    await Promise.all(
        players.map((p, i) =>
            User.makeTestUser({
                ...p,
                created: new Date(Date.now() - i * ONE_DAY_MS),
            })
        )
    );
    console.log("🌳 Success Planting Starter Data");
}
