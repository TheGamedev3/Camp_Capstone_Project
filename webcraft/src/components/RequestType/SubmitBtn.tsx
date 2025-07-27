
"use client"

import { forwardRef, useState, useRef, useEffect } from "react";
import { useRequesterContext } from "./Requester";

type SubmitBtnProps = {
  text: string;
  styling?: string; // Tailwind or className string
  disableOnSuccess: boolean;
};

export const SubmitBtn = forwardRef<HTMLButtonElement, SubmitBtnProps>(
  ({ text, styling, disableOnSuccess = true }, ref) => {
    const { submit, registerSubmitBtn } = useRequesterContext();
    const [disabled, setDisabled] = useState(false);

    const handleClick = async () => {
      if (disabled) return;
      setDisabled(true);
      
      let success = false;
      try {
        success = await submit();
      } finally {
        if (!(disableOnSuccess && success)) setDisabled(false);
      }
    };

    const localRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      const btn = (ref && typeof ref !== "function") ? ref.current : localRef.current;
      registerSubmitBtn(btn || null); // Register to context
    }, [ref, registerSubmitBtn]);

    return (
      <button
        ref={ref || localRef}
        onClick={handleClick}
        disabled={disabled}
        className={styling}
      >
        {text}
      </button>
    );
  }
);
