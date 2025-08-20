"use client";

import { useState } from "react";
import Slot from "@Gameplay/Items/Slot";
import type { Item } from "@/Gameplay/Items/Items";
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
    <div className="w-full flex flex-wrap justify-start items-start gap-2 rounded-xl bg-neutral-800/70 p-2">
      {items.filter(Boolean).map((item, i) => (
        <Slot {...item} key={item.slotId ?? i} />
      ))}
    </div>
  </>);
}