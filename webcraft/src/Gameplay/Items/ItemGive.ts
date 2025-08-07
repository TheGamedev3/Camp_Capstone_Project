
import { Item, allItems } from "./Items";


export function interpretQuantities(itemList: string): [Item, number][] {
  const entries = itemList.split(',').map(entry => entry.trim());

  const result: [Item, number][] = [];

  for (const entry of entries) {
    const match = entry.match(/^([a-zA-Z0-9\s]+?)(?:\s*\((\d+)\))?$/);

    if (match) {
      const itemName = match[1].trim();
      const quantity = match[2] ? parseInt(match[2]) : 1;

      const item = allItems.find(i=>i.name === itemName);
      if (!item) {
        console.error(`Item "${itemName}" not found in allItems.`);
        continue;
      }

      result.push([item, quantity]);
    } else {
      console.error(`Could not parse entry: "${entry}"`);
    }
  }

  return result;
}

import { UnderSession } from "../Routes/UponSession";
import { PlaySession } from "../Simulator/PlaySession";
function supposeItem(session: PlaySession, itemBase: Item, create: boolean=true): Item{
    let item: Item | undefined = session.items.find(i=>i.name === itemBase.name);
    if(item === undefined && create){
        item = {...itemBase}; // PICK WHAT DATA SPECIFICALLY TO CONSTRUCT IT! MAYBE AN ITEM CONSTRUCTOR????
        session.items.push(item);
    }
    // possibly give a unique id?
    // depends on if stackable or not
    // ADD ITEM TO THINGY
    // think of making a separate obtainedItem class for Item instances in the inventory?
    return (item as Item);
}

export const giveCommand = UnderSession((session, itemList: string)=>{
    
    interpretQuantities(itemList).forEach(([item, quantity])=>supposeItem(session, item, true).quantity+=quantity)
    // return{success, tileData: session.tileBucket[tileId]}
    // which means, potentially flag in other events into the server like inventory changed?
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