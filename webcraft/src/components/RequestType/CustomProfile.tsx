"use client";

import { useRequesterContext } from "./Requester";
import { useState, useEffect } from "react";

// const loadingURL = "https://th.bing.com/th/id/R.af911bc3b93f9ab53a3cae65e5c00bb9?rik=LHE9neaaNi%2bKPg&pid=ImgRaw&r=0";
const unavalibleURL = "https://cdn1.iconfinder.com/data/icons/users-and-avatars/32/user_male_block_ban_disabled_unavailable_profile-512.png";

type CustomProfileProps = {
  url?: string;
};

export function CustomProfile({
  url,
}: CustomProfileProps) {
  // 0 - invalid, 1 - valid, 2 - loading
  const images: Record<number, string> = {
    0: unavalibleURL,
    1: url || unavalibleURL,
    2: loadingURL,
  };
  const [imageState, setImageState] = useState(2);

  // Check if the URL is a valid image
  useEffect(() => {
    let canceled = false; // prevents race conditions of say outdated images loading
    setImageState(2);
    if (!url) return setImageState(0);

    const img = new Image();
    img.onload = () => !canceled && setImageState(1);
    img.onerror = () => !canceled && setImageState(0);
    img.src = url;

    return () => { canceled = true; };
  }, [url]);

  return (
    <div className="mt-2">
      <img src={images[imageState]} alt="Preview" className="max-w-full max-h-64 rounded shadow" />
    </div>
  );
}
