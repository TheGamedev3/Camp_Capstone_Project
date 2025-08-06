
"use client";
import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";
import { getRoute } from "@/utils/request";
import { useSession } from "@/components/RootType/UserSession";

type GameData = unknown;

type GameDataContextType = {
  GameData: GameData | null;
  updateTile: (tileId: string, tileStack: any[]) => void;
};

const GameDataContext = createContext<GameDataContextType | null>(null);
export const useGameData = () => useContext(GameDataContext)!;

export function GameDataSession({ children }){
    const[GameData, updateGameData] = useState<GameData | null>(null);
    const contextValue = useMemo(() => ({
        GameData,
        updateTile(tileId: string, tileStack: any[]){
            updateGameData(gamedata => {
            if (!gamedata) return null;

            return {
                ...gamedata,
                tileBucket: {
                ...gamedata.tileBucket,
                [tileId]: tileStack
                }
            };
            });
        }
    }), [GameData]);

    const { user } = useSession();

    type Fetcher = {
        pinging?: NodeJS.Timeout;
        startPing: () => void;
        endPing: () => void;
    };

    const fetcher = useRef<Fetcher>({
        pinging: undefined,
        startPing() {
            if (this.pinging) return;
            this.pinging = setInterval(async () => {
                const { success, result } = await getRoute({ route: "GET /api/ping" });
                if (success) updateGameData(result);
            }, 3000);
        },
        endPing() {
            if (this.pinging) {
            clearInterval(this.pinging);
            this.pinging = undefined;
            }
        }
    });

    // React hook to start/stop pinging based on user
    useEffect(() => {
        const fetchInst = fetcher.current;
        user ? fetchInst.startPing() : fetchInst.endPing();

        return () => fetchInst.endPing(); // Cleanup on unmount
    }, [user]);
        
    return (
        <GameDataContext.Provider value={contextValue}>
            {children}
        </GameDataContext.Provider>
    );
}

export function useTile(id: string) {
    const { GameData } = useGameData();
    const [myTileData, setTileData] = useState<string>('');

    useEffect(() => {
        const tileData = JSON.stringify(GameData?.tileBucket?.[id]);
        if (tileData !== myTileData) {
            setTileData(tileData);
        }
    }, [GameData, id]);

    const myTileStack = myTileData ? JSON.parse(myTileData) : [];
    if(myTileStack.length === 0){return[]}
    return myTileStack;
}

