"use client";

import Link from "next/link";

export function Tab({icon, span, href}:{icon: React.ReactNode, span: string, href: string}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors"
    >
      {icon}<span>{span}</span>
    </Link>
  );
}
