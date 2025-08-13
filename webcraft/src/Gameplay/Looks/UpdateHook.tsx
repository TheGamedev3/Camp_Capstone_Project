"use client";
import { createContext, useContext, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { getRoute } from "@/utils/request";
import { useSession } from "@/components/RootType/UserSession";
import type { Item } from "../Items/Items";

type TileLayer = unknown;
type TileStack = TileLayer[];

type GameData = {
  userId: string;
  gridXSize: number; gridYSize: number;
  tileBucket: Record<string, TileStack>;
  inventory: Item[];
  // timestamp is still present from server, but we DO NOT use it for merging/cleanup anymore
  timestamp: number;
};

export type ClientData = GameData;

type GameDataContextType = {
  // server snapshot (authoritative, last applied)
  GameData: GameData | null;

  // merged, client-facing (server + local optimistic overlays)
  ClientData: ClientData | null;

  // hovers
  hoverBucket: Record<string, any>;

  // setters
  updateGameData: React.Dispatch<React.SetStateAction<GameData | null>>;
  updateHoverBucket: React.Dispatch<React.SetStateAction<Record<string, any>>>;

  // local optimistic overlays
  pushLocalItemChange: (item: Item, delta?: number) => { unmount: () => void };
  pushLocalTileChange: (tileId: string, Tile: TileLayer) => { unmount: () => void };
};

const GameDataContext = createContext<GameDataContextType | null>(null);
export const useGameData = () => useContext(GameDataContext)!;

/* ========= local overlays (no timestamps needed) ========= */

type ItemDelta = { id: string; name: string; delta: number };
type Preview = { id: string; node: TileLayer };
type PreviewBucket = Record<string, Preview[]>;

function rid() { return Math.random().toString(36).slice(2, 9); }

export function GameDataSession({ children }:{ children: React.ReactNode }) {
  const [GameData, updateGameData] = useState<GameData | null>(null);
  const [hoverBucket, updateHoverBucket] = useState<Record<string, any>>({});

  // overlays
  const [itemDeltas, setItemDeltas] = useState<ItemDelta[]>([]);
  const [previewTiles, setPreviewTiles] = useState<PreviewBucket>({});

  // push −/+ item delta (optimistic)
  const pushLocalItemChange = useCallback((item: Item, delta: number = -1) => {
    const name = item?.name;
    if (!name) return { unmount(){} };

    const entry: ItemDelta = { id: rid(), name, delta };
    setItemDeltas(prev => [...prev, entry]);

    return {
      unmount() {
        setItemDeltas(prev => prev.filter(d => d.id !== entry.id));
      }
    };
  }, []);

  // push visual preview onto a tile (optimistic)
  const pushLocalTileChange = useCallback((tileId: string, Tile: TileLayer) => {
    const id = rid();
    const entry: Preview = { id, node: Tile };

    setPreviewTiles(prev => {
      const arr = prev[tileId] ?? [];
      return { ...prev, [tileId]: [...arr, entry] };
    });

    return {
      unmount() {
        setPreviewTiles(prev => {
          const arr = prev[tileId] ?? [];
          const next = arr.filter(p => p.id !== id);
          if (next.length) return { ...prev, [tileId]: next };
          const { [tileId]: _, ...rest } = prev;
          return rest;
        });
      }
    };
  }, []);

  /* ====== ClientData = GameData + ALL current overlays (no ts filters) ====== */
  const ClientData: ClientData | null = useMemo(() => {
    if (!GameData) return null;

    // 1) tiles: copy server stacks + append all previews
    const mergedTiles: Record<string, TileStack> = {};
    for (const k of Object.keys(GameData.tileBucket || {})) {
      mergedTiles[k] = [...(GameData.tileBucket[k] ?? [])];
    }
    for (const [tileId, arr] of Object.entries(previewTiles)) {
      if (arr.length) {
        (mergedTiles[tileId] ??= []).push(...arr.map(p => p.node));
      }
    }

    // 2) inventory: compute per-name delta and overlay onto each item’s displayed quantity
    const serverTotals = new Map<string, number>();
    for (const it of GameData.inventory ?? []) {
      const n = it?.name;
      if (!n) continue;
      const q = typeof it.quantity === "number" ? it.quantity : 0;
      serverTotals.set(n, (serverTotals.get(n) ?? 0) + q);
    }

    const deltaTotals = new Map<string, number>();
    for (const d of itemDeltas) {
      deltaTotals.set(d.name, (deltaTotals.get(d.name) ?? 0) + d.delta);
    }

    const clientInventory = (GameData.inventory ?? []).map((it) => {
      const n = it?.name;
      if (!n) return it;
      const base = serverTotals.get(n) ?? 0;
      const extra = deltaTotals.get(n) ?? 0;
      return { ...it, quantity: base + extra };
    });

    return { ...GameData, tileBucket: mergedTiles, inventory: clientInventory };
  }, [GameData, itemDeltas, previewTiles]);

  /* ====== server ping (no timestamp logic) ====== */
  const { user } = useSession();
  // simple in-flight request counter to drop late responses
  const reqCounter = useRef(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;
    let inFlight = false;

    const tick = async () => {
      if (cancelled || inFlight) return;
      if (typeof document !== "undefined" && document.hidden) return;
      inFlight = true;
      const myReqNum = ++reqCounter.current;
      try {
        const { success, result } = await getRoute({ route: "GET /api/ping" });
        if (!success || !result) return;
        // ignore responses that are older than a newer started request
        if (myReqNum !== reqCounter.current) return;

        // replace with latest snapshot; optimistic overlays remain on top
        updateGameData(result as GameData);
      } finally {
        inFlight = false;
      }
    };

    tick();
    timer = setInterval(tick, 3000);
    return () => { cancelled = true; if (timer) clearInterval(timer); };
  }, [user, updateGameData]);

  /* ====== provide context (include GameData!) ====== */
  const contextValue = useMemo<GameDataContextType>(() => ({
    GameData,
    ClientData,
    hoverBucket,
    updateGameData,
    updateHoverBucket,
    pushLocalItemChange,
    pushLocalTileChange
  }), [
    GameData,
    ClientData,
    hoverBucket,
    updateGameData,
    updateHoverBucket,
    pushLocalItemChange,
    pushLocalTileChange
  ]);

  return (
    <GameDataContext.Provider value={contextValue}>
      {children}
    </GameDataContext.Provider>
  );
}

/* ====== stable useTile (no new array unless needed) ====== */

const EMPTY: any[] = [];

export function useTile(id: string) {
  const { ClientData, hoverBucket } = useGameData();
  const myStack = ClientData?.tileBucket?.[id] ?? null;
  const myHover = hoverBucket[id] ?? EMPTY;

  const merged = useMemo(() => {
    if (!myStack) return null;
    if (myHover.length === 0) return myStack; // reuse server ref
    return [...myStack, ...myHover];          // only merge when needed
  }, [myStack, myHover]);

  return merged;
}
