"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getRoute } from "@/utils/request";
import { PlayerType } from "@types/Player";

export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export function UserSession({ children, session }){
  const[user, updateUserState] = useState<PlayerType | null>(session);
  return (
    <SessionContext.Provider value={{
      user,
      async updateUser(newInfo: object | null = null){
        let newUserInfo = newInfo;
        if(newInfo === null){
          const{success, result} = await getRoute("GET /api/myInfo");
          if(success)newUserInfo = result;
        }
        if(newInfo !== null)updateUserState(newInfo);
      }
    }}>
      {children}
    </SessionContext.Provider>
  );
}
