"use client";

import { useState } from "react";
import Slot from "@Gameplay/Items/Slot";
import { Item } from "@/Gameplay/Items/Items";
import { ItemCmd } from "@/Gameplay/Items/ItemFlow";
import { TextField, TextFieldProps } from "./TextField";

function processString(itemCmd: string):Item[]{
  return ItemCmd({cmd: itemCmd}).getItems();
}

export function ItemsField(struct:TextFieldProps){
  const [items, setItems] = useState<Item[]>(processString(struct.defaultText || ''));

  // since struct.inputType is === Items, manually set it to be text!
  return(<>
    <TextField
      {...struct}
      inputType='text'
      onChange={(_success, text)=>{
        setItems(processString(text));
      }}
    />
    {items.map((item, i)=><Slot {...item} key={i}/>)}
  </>);
}