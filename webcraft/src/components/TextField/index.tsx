
"use client"

import { useForumContext } from "../Forum";

export function TextField(
    {bodyField, clientValidate, process, defaultText, placeholderText}
){
  const { errors, setField } = useForumContext();

  return (
    <>
      <input
        onChange={(e) => {setField(bodyField, e.target.value)}}
      />
      {errors[bodyField] && <div className="error">{errors[bodyField]}</div>}
    </>
  );
}



