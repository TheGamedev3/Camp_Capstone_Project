"use client"; // at the top

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    const run = async () => {
      console.log("creating steve...");
      const res = await fetch("/api/test/createUser");
      const json = await res.json();
      console.log(json);
    };
    run();
  }, []);

  return <h1>CREATING USER STEVE</h1>;
}
