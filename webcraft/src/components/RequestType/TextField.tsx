"use client";

import { useRequesterContext } from "./Requester";

type TextFieldProps = {
  label?: string;
  bodyField: string;
  defaultText?: string;
  placeholderText?: string;
  inputType?: string;
  inputRef?: (el: HTMLInputElement | null) => void; // optional ref function
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // optional key handler
};

export function TextField({
  label = "",
  bodyField,
  defaultText = "",
  placeholderText = "",
  inputType='text',
  inputRef, onKeyDown
}: TextFieldProps) {
  const { errors, setField } = useRequesterContext();

  return (
    <div className="w-full">
      {/* Field Label */}
      <div className="mb-1 text-sm font-medium text-gray-700"> {label} </div>
      <input
        name={bodyField}
        type={inputType}
        defaultValue={defaultText}
        placeholder={placeholderText}
        className="w-full px-4 py-2 border border-gray-300 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          setField(bodyField, e.target.value);
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
