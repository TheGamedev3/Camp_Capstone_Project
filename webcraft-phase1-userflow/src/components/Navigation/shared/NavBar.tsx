"use client";

import { useSession } from "@/components/RootType/UserSession";
import { EntryLinks } from "../entry/index.jsx"
import { SessionLinks } from "../session/index.jsx"

export function NavBar() {
  const{user} = useSession();
  return(
    <nav className="flex justify-center items-center p-4 bg-gray-900 shadow-md">
      <div className="flex gap-6 items-center">
        {user ? <SessionLinks/> : <EntryLinks/>}
      </div>
    </nav>
  );
}

// is used in "@/components/RootType/index.tsx"

