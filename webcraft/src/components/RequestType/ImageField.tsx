"use client";

import { useRequesterContext } from "./Requester";
import { useState, useEffect } from "react";
import { CustomProfile } from "./CustomProfile";

type ImageFieldProps = {
  label?: string;
  bodyField: string;
  process?: (value: string) => any;
  defaultText?: string;
  placeholderText?: string;
  inputRef?: (el: HTMLInputElement | null) => void; // optional ref function
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // optional key handler
};

export function ImageField({
  label = "",
  bodyField,
  process,
  defaultText = "",
  placeholderText = "",
  inputRef, onKeyDown,
}: ImageFieldProps) {
  const { errors, setField } = useRequesterContext();
  const [url, setUrl] = useState(defaultText);

  return (
    <div className="w-full">
      <CustomProfile url={url}/>
      {/* Field Label */}
      <div className="mb-1 text-sm font-medium text-gray-700"> {label} </div>
      <input
        type="text"
        defaultValue={defaultText}
        placeholder={placeholderText}
        className="w-full px-4 py-2 border border-gray-300 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          const value = e.target.value;
          setUrl(value);
          setField(bodyField, value);
        }}

        // for selecting the next field:
        ref={inputRef}
        onKeyDown={onKeyDown}
      />
      {errors[bodyField] && (
        <div className="mt-1 text-sm text-red-500">{errors[bodyField]}</div>
      )}
    </div>
  );
}
