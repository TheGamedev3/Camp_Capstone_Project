"use client"; // at the top

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    const run = async () => {
      console.log("fetching steve...");
      const res = await fetch("/api/test/fetchUser");
      const json = await res.json();
      console.log(json);
    };
    run();
  }, []);

  return <h1>FETCHING USER STEVE</h1>;
}
