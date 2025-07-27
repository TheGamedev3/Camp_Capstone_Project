"use client";

import React from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <header className={`text-center my-6 ${className || ""}`}>
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
      )}
    </header>
  );
}

export default PageHeader;
