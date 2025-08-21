"use client";

import { useState } from "react";
import Slot from "@Gameplay/Items/Slot";
import type { Item } from "@/Gameplay/Items/Items";
import { ItemCmd } from "@/Gameplay/Items/ItemFlow";
import { TextField, TextFieldProps } from "./TextField";
import { useGameData } from "@/Gameplay/Looks/UpdateHook";
import type { PlaySession } from "@/Gameplay/Simulator/PlaySession";

function processString(session?: PlaySession, itemCmd: string):Item[]{
  return ItemCmd({session, cmd: itemCmd}).getDeltaItems();
}

function ItemDisplay({items, slotClicked}:{items: Item[]; slotClicked?: (item?:Item)=>void}){
  return(
    <div className="w-full flex flex-wrap justify-start items-start gap-2 rounded-xl bg-neutral-800/70 p-2">
      {items.filter(Boolean).map((item, i) => (
        <Slot item={item} key={item.slotId ?? i} onClick={slotClicked} />
      ))}
    </div>
  );
}

export function ItemsField(struct:TextFieldProps & {slotClicked?: (item?:Item)=>void}){
  const [items, setItems] = useState<Item[]>(processString(null, struct.defaultText || ''));

  // since struct.inputType is === items, manually set it to be text!
  return(<>
    <TextField
      {...struct}
      inputType='text'
      onChange={(_success, text)=>{
        setItems(processString(null, text));
      }}
    />
    <ItemDisplay items={items} slotClicked={struct.slotClicked}/>
  </>);
}

export function BuyItemsField(struct:TextFieldProps & {slotClicked?: (item?:Item)=>void}){
  const { ClientData } = useGameData();
  const [items, setItems] = useState<Item[]>(processString(ClientData, struct.defaultText || ''));

  // since struct.inputType is === buyItems, manually set it to be text!
  return(<>
    <TextField
      {...struct}
      inputType='text'
      onChange={(_success, text)=>{
        setItems(processString(ClientData, text));
      }}
    />
    <ItemDisplay items={items} slotClicked={struct.slotClicked}/>
  </>);
}