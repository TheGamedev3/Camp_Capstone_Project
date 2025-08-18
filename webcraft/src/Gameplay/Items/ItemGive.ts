
import { Item, allItems } from "./Items";


// name = anything not parentheses; quantity = optional (+/-)int inside ()
const rx = /^\s*([^()]+?)\s*(?:\(\s*([+-]?\d+)\s*\))?\s*$/;

export function interpretQuantities(itemList: string): [Item, number][] {
  return itemList
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length)
    .flatMap(entry => {
      const m = entry.match(rx);
      if (!m) {
        console.error(`Could not parse entry: "${entry}"`);
        return [];
      }
      const itemName = m[1].trim();
      const qty = m[2] !== undefined ? parseInt(m[2], 10) : 1;

      const item = allItems.find(i => i.name === itemName);
      if (!item) {
        console.error(`Item "${itemName}" not found in allItems.`);
        return [];
      }
      return [[item, qty] as [Item, number]];
    });
}

import { ReqFit } from "../Routes/ReqFit";
import { PlaySession } from "../Simulator/PlaySession";
import { randomBytes } from 'crypto';

function supposeItem(session: PlaySession, itemBase: Item, create: boolean=true): Item{
    let item: Item | undefined = session.inventory.find(i=>i.name === itemBase.name);
    if((item === undefined || itemBase.itemType === 'breakTool') && create){
        // create an item w/ an unique id
        item = {...itemBase, slotId: randomBytes(16).toString('hex') }; // PICK WHAT DATA SPECIFICALLY TO CONSTRUCT IT! MAYBE AN ITEM CONSTRUCTOR????
        session.inventory.push(item);
    }
    // depends on if stackable/ is a tool or not
    return (item as Item);
}

export const giveCommand = ReqFit<{itemCmd: string}>(({session, itemCmd})=>{
    interpretQuantities(itemCmd).forEach(([item, quantity])=>{
      if(item.itemType === 'breakTool'){
        if(quantity < 0)throw new Error(`ATTEMPTED TO SUBTRACT A NONSTACKABLE TOOL! ${item} (${quantity})`);
        // non stackable
        for (let i = 0; i < quantity; i++) {
          const targetItem = supposeItem(session, item, true);
          targetItem.quantity=1;
          session.itemChange(targetItem);
        }
        // FIX FIX FIX, IF SUBTRACT, THEN TAKE
        // CONSIDER MERGING HERE
      }else{
        const targetItem = supposeItem(session, item, true);
        targetItem.quantity??=0;
        targetItem.quantity+=quantity;
        session.itemChange(targetItem);
      }
    });
});

//export const exchange = ReqFit((session, clientSide, costList: string, outputList: string, conditions: ()=>boolean)=>{
    
    // return{success, tileData: session.tileBucket[tileId]}
//});


// EXCHANGE LOGIC

// Get Items...
// Has Items?
// Take Items (string? or Item[]?)

// Get Items -> Item map
// Item map.affords("string (3), iron (5)")
// (cache the afford value)
// Item map.take()
  // reevaluate the afford value if its false
  // then take away

// refactor crafting to allow that



// collect all items from the item list, example, cobblestone (3), metals (4s), ...
// add or subtract them accordingly
// the items have an icon

// maybe make a onGameSession hook so these can be put under each request


// craft route
// trade with others route