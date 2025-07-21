
"use client"

import { useState } from "react";
import { useForumContext } from "../Forum";

type SubmitBtnProps = {
  text: string;
  styling?: string; // Tailwind or className string
};

export function SubmitBtn({ text, styling }: SubmitBtnProps) {
  const { submit } = useForumContext();
  const [disabled, setDisabled] = useState(false);

  const handleClick = async () => {
    setDisabled(true);
    try {
      await submit();
    } finally {
      setDisabled(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={styling}
    >
      {text}
    </button>
  );
}
