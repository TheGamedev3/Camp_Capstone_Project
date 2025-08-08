
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

import { UnderSession } from "../Routes/UponSession";
import { PlaySession } from "../Simulator/PlaySession";
import { randomBytes } from 'crypto';

function supposeItem(session: PlaySession, itemBase: Item, create: boolean=true): Item{
    let item: Item | undefined = session.inventory.find(i=>i.name === itemBase.name);
    if(item === undefined && create){
        item = {...itemBase, slotId: randomBytes(16).toString('hex') }; // PICK WHAT DATA SPECIFICALLY TO CONSTRUCT IT! MAYBE AN ITEM CONSTRUCTOR????
        session.inventory.push(item);
    }
    // possibly give a unique id?
    // depends on if stackable or not
    // ADD ITEM TO THINGY
    // think of making a separate obtainedItem class for Item instances in the inventory?
    return (item as Item);
}

export const giveCommand = UnderSession((session, itemList: string)=>{
    
    interpretQuantities(itemList).forEach(([item, quantity])=>{
      const targetItem = supposeItem(session, item, true);
      targetItem.quantity??=0;
      targetItem.quantity+=quantity;
      session.itemChange(targetItem, quantity);
    });
    // return{success, tileData: session.tileBucket[tileId]}
    // which means, potentially flag in other events into the server like inventory changed?
    // REMEMBER TO TURN ON ESLINT OR WHATEVER
    /*
    [
    
    ]
    */
});
export const exchange = UnderSession((session, costList: string, outputList: string, conditions: ()=>boolean)=>{
    
    // return{success, tileData: session.tileBucket[tileId]}
});



// collect all items from the item list, example, cobblestone (3), metals (4s), ...
// add or subtract them accordingly
// the items have an icon

// maybe make a onGameSession hook so these can be put under each request


// craft route
// trade with others route