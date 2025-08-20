"use client";

import { useState } from "react";
import { CustomProfile } from "./CustomProfile";
import { TextField, TextFieldProps } from "./TextField";

export function ImageField(struct:TextFieldProps){
  const [url, setUrl] = useState<string>(struct.defaultText || '');

  // since struct.inputType is === Image, manually set it to be text!
  return(<>
    <TextField
      {...struct}
      inputType='text'
      onChange={(_success, text)=>setUrl(text)}
    />
    <CustomProfile url={url}/>
  </>);
}