
// give a data context

"use client"

import PageHeader from "@/components/PageHeader";
import { EntriesLayout } from "./entriesFormat";
import { useState, createContext, useContext } from "react";

type TradeType = unknown;

type PageDataType = {
  success?:boolean;
  err?:Record<string, unknown>;
  trades?:TradeType[];
  totalPages?:number;
}

type PageDataCtxType = {
  PageData: PageDataType;
  givePageData: (data: PageDataType ) => void;
};
export const PageDataContext = createContext<PageDataCtxType | null>(null);
export const usePageData = () => useContext(PageDataContext);

export default function PlayersPage(){
  const [PageData, givePageData] = useState<PageDataType>({
    success: false,
    err: null,
    trades: [],
    totalPages: 0
  });
  return (
    <PageDataContext.Provider value={{PageData, givePageData}}>
      <div className="p-8">
        <PageHeader
          title="Trades"
          subtitle="All avaliable trades"
        />
          <EntriesLayout/>
      </div>
    </PageDataContext.Provider>
  );
}
