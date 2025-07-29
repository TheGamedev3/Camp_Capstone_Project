
// give a data context

"use client"

import PageHeader from "@/components/PageHeader";
import { EntriesLayout } from "./entriesFormat";
import { useState, createContext, useContext } from "react";

type PageDataType = {
  success?:boolean;
  err?:any;
  players?:Record<string,any>;
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
    players: [],
    totalPages: 0
  });
  return (
    <PageDataContext.Provider value={{PageData, givePageData}}>
      <div className="p-8">
        <PageHeader
          title="Players"
          subtitle="All registered players in the world"
        />
          <EntriesLayout/>
      </div>
    </PageDataContext.Provider>
  );
}
