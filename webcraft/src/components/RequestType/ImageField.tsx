"use client";

import { useRequesterContext } from "./Requester";
import { useState, useEffect } from "react";

type ImageFieldProps = {
  bodyField: string;
  process?: (value: string) => any;
  defaultText?: string;
  placeholderText?: string;
};

export function ImageField({
  bodyField,
  process,
  defaultText = "",
  placeholderText = "",
}: ImageFieldProps) {
  const { errors, setField } = useRequesterContext();
  const [url, setUrl] = useState(defaultText);
  const [isValidImage, setIsValidImage] = useState(false);

  // Check if the URL is a valid image
  useEffect(() => {
    if (!url) return setIsValidImage(false);
    const img = new Image();
    img.onload = () => setIsValidImage(true);
    img.onerror = () => setIsValidImage(false);
    img.src = url;
  }, [url]);

  return (
    <div className="w-full">
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
      />
      {errors[bodyField] && (
        <div className="mt-1 text-sm text-red-500">{errors[bodyField]}</div>
      )}
      {isValidImage && (
        <div className="mt-2">
          <img src={url} alt="Preview" className="max-w-full max-h-64 rounded shadow" />
        </div>
      )}
    </div>
  );
}
