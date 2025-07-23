"use client";

import { useRequesterContext } from "../Requester";

type TextFieldProps = {
  bodyField: string;
  process?: (value: string) => any;
  defaultText?: string;
  placeholderText?: string;
  inputType?: string;
};

export function TextField({
  bodyField,
  process,
  defaultText = "",
  placeholderText = "",
  inputType='text'
}: TextFieldProps) {
  const { errors, setField } = useRequesterContext();

  return (
    <div className="w-full">
      <input
        type={inputType}
        defaultValue={defaultText}
        placeholder={placeholderText}
        className="w-full px-4 py-2 border border-gray-300 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          setField(bodyField, e.target.value);
        }}
      />
      {errors[bodyField] && (
        <div className="mt-1 text-sm text-red-500">{errors[bodyField]}</div>
      )}
    </div>
  );
}
