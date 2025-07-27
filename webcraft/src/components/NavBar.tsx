"use client";

import Link from "next/link";
import { Users, Globe, Backpack, BookOpen, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export function NavBar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [hovering, setHovering] = useState(false);

  // Add a slight delay before hiding dropdown
  useEffect(() => {
    if (!hovering) {
      const timer = setTimeout(() => setDropdownOpen(false), 200); // 200ms linger
      return () => clearTimeout(timer);
    } else {
      setDropdownOpen(true);
    }
  }, [hovering]);

  return (
    <nav className="flex justify-center items-center p-4 bg-gray-900 shadow-md">
      <div className="flex gap-6 items-center">
        <Link
          href="/players"
          className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors"
        >
          <Users size={18} /> <span>Players</span>
        </Link>
        <Link
          href="/world"
          className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors"
        >
          <Globe size={18} /> <span>World</span>
        </Link>
        <Link
          href="/myProfile"
          className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors"
        >
          <Backpack size={18} /> <span>Inventory</span>
        </Link>
        <Link
          href="/howto"
          className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors"
        >
          <BookOpen size={18} /> <span>How To</span>
        </Link>

        {/* Settings (Dropdown) */}
        <div
          className="relative"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <button className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors">
            <Settings
              size={18}
              className={hovering ? "animate-spin-slow" : ""}
            />
            <span>Settings</span>
          </button>

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md transform transition-all duration-200 ease-out
            ${isDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
          >
            <Link
              href="/mySettings"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Edit Profile
            </Link>
            <Requester
                request="POST /api/logout"
                goTo='/login'
            >
                <LogoutLink/>
            </Requester>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useRequesterContext, Requester } from "@Req";
function LogoutLink(){
    const { submit } = useRequesterContext();
    const [disabled, setDisabled] = useState(false);

    return(
        <Link
            className="block px-4 py-2 text-red-500 hover:bg-gray-100"
            href=''
            onClick={(e: React.MouseEvent)=>{
                if(disabled)return;
                setDisabled(true);
                e.preventDefault();
                submit();
            }}
        >
            Logout
        </Link>
    );
}