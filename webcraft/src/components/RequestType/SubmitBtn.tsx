"use client"

import { forwardRef, useState, useRef, useEffect } from "react";
import { useRequesterContext } from "./Requester";

type SubmitBtnProps = {
  text: string;
  styling?: string; // Tailwind or className string

  pendingText?: string;
  pendingStyle?: string; // Tailwind or className string

  disableOnSuccess?: boolean;
};

// eslint-disable-next-line react/display-name
export const SubmitBtn = forwardRef<HTMLButtonElement, SubmitBtnProps>(
  (
    {
      text,
      styling,
      pendingText,
      pendingStyle,
      disableOnSuccess = true,
    },
    ref
  ) => {
    const { forumName, submit, registerSubmitBtn } = useRequesterContext();
    const [disabled, setDisabled] = useState(false);

    const handleClick = async () => {
      if (disabled) return;
      setDisabled(true);

      let success = false;
      try {
        success = await submit();
      } finally {
        if (!(disableOnSuccess && success)) {
          setDisabled(false);
        }
      }
    };

    const localRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
      const btn =
        ref && typeof ref !== "function" ? ref.current : localRef.current;
      registerSubmitBtn(btn || null); // Register to context
    }, [ref, registerSubmitBtn]);

    // pick styles/text depending on disabled state
    const currentClass = disabled
      ? pendingStyle ?? styling
      : styling;

    const currentText = disabled
      ? pendingText ?? text
      : text;

    return (
      <button
        name={`${forumName}-submit`}
        ref={ref || localRef}
        onClick={handleClick}
        disabled={disabled}
        className={currentClass}
      >
        {currentText}
      </button>
    );
  }
);
