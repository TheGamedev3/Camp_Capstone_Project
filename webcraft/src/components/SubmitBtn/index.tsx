
"use client"

import { useState } from "react";
import { useRequesterContext } from "../Requester";

type SubmitBtnProps = {
  text: string;
  styling?: string; // Tailwind or className string
  disableOnSuccess: boolean;
};

export function SubmitBtn({ text, styling, onSuccess, disableOnSuccess=true }: SubmitBtnProps) {
  const { submit } = useRequesterContext();
  const [disabled, setDisabled] = useState(false);

  const handleClick = async () => {
    setDisabled(true);
    let success = false;
    try {success = await submit()}
    finally {
      if(!(disableOnSuccess && success))setDisabled(false);
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
