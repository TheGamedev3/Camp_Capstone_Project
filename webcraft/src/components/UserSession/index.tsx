"use client";
import { createContext, useContext } from "react";

export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export function UserSession({ children, session }) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
