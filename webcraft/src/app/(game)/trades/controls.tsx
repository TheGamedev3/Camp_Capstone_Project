"use client"

import { useEffect, useState } from "react";
import { useQueryParams } from "./paramHook";
import { usePageData } from "./page";

export function SearchControls() {
  const { PageData } = usePageData();
  const { getParam, setParams } = useQueryParams();

  const page = getParam("page") || "1";
  const rawSearch = getParam("search") || "";
  const sortStyle = getParam("sortStyle") || "newest";

  // Local state for debounce
  const [localSearch, setLocalSearch] = useState(rawSearch);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localSearch !== rawSearch) {
        setParams({ page: "1", search: localSearch });
      }
    }, 200); // adjust debounce delay here

    return () => clearTimeout(timeout);
  }, [localSearch]);

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div>
        <label>🔍 Search</label>
        <input
          name="seller search"
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full border p-1 rounded"
        />
      </div>

      {/* Dropdown */}
      <div>
        <label>🫗Sort</label>
        <select
          name="sort style"
          value={sortStyle}
          onChange={(e)=>setParams({ page: "1", sortStyle: e.target.value })}
          className="w-full border p-1 rounded"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <PageNavigator />
    </div>
  );
}

function PageNavigator() {
  const { getParam, setParam } = useQueryParams();
  const { PageData } = usePageData();

  const totalPages = PageData?.totalPages || 1;
  const currentPage = parseInt(getParam("page") || "1");

  const goTo = (page: number) => {
    const clamped = Math.max(1, Math.min(totalPages, page));
    setParam("page", clamped);
  };

  return (
    <div className="flex justify-between items-center mt-6 px-2">
      <button
        name="back a page"
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        ◀
      </button>

      <div name="pages" className="text-sm text-gray-600">
        Page <strong>{currentPage}</strong> of {totalPages}
      </div>

      <button
        name="forward a page"
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        ▶
      </button>
    </div>
  );
}
