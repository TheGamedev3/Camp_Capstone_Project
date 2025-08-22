
// collect all items from the item list, example, cobblestone (3), metals (4s), ...
// add or subtract them accordingly

import { Item, allItems } from "./ItemsClient";
import { randomBytes } from "crypto";
import type { PlaySession } from "../Simulator/PlaySession";

// name is one of:
//   1) <...>     (protected token)
//   2) {...}     (protected token)
//   3) anything without parentheses
// followed by optional "(±int)" quantity
const rx = /^\s*(<[^>]+>|\{[^}]+\}|[^()]+?)\s*(?:\(\s*([+-]?\d+)\s*\))?\s*$/;
/*
EXAMPLES:
"Stone (3)"            // => ["Stone (3)", "Stone", "3"]
"Stone"                // => ["Stone", "Stone", undefined]
"<abc123> (1)"         // => ["<abc123> (1)", "<abc123>", "1"]
"<abc123>"             // => ["<abc123>", "<abc123>", undefined]
'{"name":"Iron"} (2)'  // => ['{"name":"Iron"} (2)', '{"name":"Iron"}', '2']
'{"name":"Iron"}'      // => ['{"name":"Iron"}', '{"name":"Iron"}', undefined]
*/


function interpretQuantities(itemCmd: string): [string, number][] {
  return itemCmd
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length)
    .flatMap(entry => {
      const m = entry.match(rx);
      if (!m) {
        throw new Error(`Could not parse entry: "${entry}"`);
        return [];
      }
      const itemName = m[1].trim();
      const qty = m[2] !== undefined ? parseInt(m[2], 10) : 1;

      return [[itemName, qty] as [string, number]];
    });
}

function itemBase(itemName: string): Item{
    const base = allItems.find(item=>item.name===itemName);
    if(!base)return undefined;
    return {...base!, slotId: randomBytes(16).toString('hex') };
}

// new itemFlow implementation smartly allows for: caching & traversing the items more efficiently

export type existingInfo = { name: string; item?: Item; delta: number; dataItem?: Item };
export type ItemFlow = {
  existing?: existingInfo[];
  failedToParse?: boolean

  getExisting: () => existingInfo[];
  getItems: () => (Item | undefined)[];
  getDeltaItems: () => (Item | undefined)[];
  getQuantities: () => [string, number, Item | undefined][];

  give: () => void;
  specificAffordable: () => Map<Item | undefined, boolean>;
  affordable: () => boolean;
  take: () => void;
};

// if session is undefined, itll just get the regular Item profile from allItems
export function ItemCmd({ session, cmd }: { session?: PlaySession; cmd: string }):ItemFlow{
  const chain = {};

  chain.getExisting = () => {
    if (chain.existing) return chain.existing;
    try{
      chain.existing = interpretQuantities(cmd).map(([name, delta]) => {
        // parse, if name looks like "{CONTENTS}"
        let dataItem: Item | undefined = undefined;
        if (name && name.startsWith("{") && name.endsWith("}")) {
          // assuming its always a successful json
          try {
            dataItem = (JSON.parse(name) as Item);
            if (dataItem?.name) name = dataItem.name;
            if (typeof (dataItem as any).quantity === "number") delta = (dataItem as any).quantity as number;
          } catch (e) {
            console.error("Bad JSON item token:", name, e);
          }
        }

        const itemPool = session ? session.inventory : allItems;

        // name = "<ID>"
        let item: Item | undefined = undefined;
        if (name && /^<[^>]+>$/.test(name)) {
          const id = name.slice(1, -1).trim();
          if(session){
            item = itemPool.find(i => String(i.slotId) === id);
          }else{
            item = dataItem;
          }
          // keep a human name available for error messages & displays
          name = item?.name ?? name;
        } else {
          item = itemPool.find(i => i.name === name);
        }

        return {
          name,
          item,
          delta,
          dataItem
        };
      });
      chain.failedToParse = false;
    }catch{
      chain.existing = [];
      chain.failedToParse = true;
    }
    return chain.existing;
  };

  chain.getItems = () => {
    return chain.getExisting().map(({ item }) => item);
  };
  chain.getDeltaItems = () => {
    return chain.getExisting().map(({ item, delta }) => {
      if(!item)return;
      return{...item, quantity: delta}
    });
  };
  chain.getQuantities = () => {
    return chain.getExisting().map(({ name, delta, item }) => [name, delta, item]);
  };

  chain.give = () => {
    const existing = chain.getExisting();
    for (let i = 0; i < existing.length; i++) {

      // eslint-disable-next-line prefer-const
      let { name, item, delta, dataItem } = existing[i];

      // handle giving item data directly
      if (dataItem) {
        // add in unstackables directly with all their data
        if ((dataItem as Item).itemType === "breakTool") {
          const created = { ...(dataItem as Item), slotId: randomBytes(16).toString('hex'), quantity: 1 } as Item;
          session.inventory.push(created);
          session.itemChange(created);
          continue;
        }
        // else, add to existing quantities below
      }

      if (delta < 0) throw new Error(`ATTEMPTED TO GIVE LESS THAN 0!`);
      else if (delta === 0) continue;

      // (isnt already present in the inventory)
      if (item === undefined) {
        const base = itemBase(name);
        if (base === undefined) {
          throw new Error(`"${name}" NOT FOUND IN GIVE CMD ${cmd}`);
        }
        // update cached entry with the concrete item
        if (base.itemType !== "breakTool") {
          base.quantity = base.quantity ?? 0;
          chain.existing![i].item = base;
          session.inventory.push(base);
        }
        item = base;
      }


      // (an unstackable)
      if ((item as Item).itemType === "breakTool") {
        for (let t = 0; t < delta; t++) {
          const targetItem = itemBase(name);
          if (!targetItem) throw new Error(`"${name}" NOT FOUND IN GIVE CMD ${cmd}`);
          targetItem.quantity = 1;
          session.inventory.push(targetItem);
          session.itemChange(targetItem);
        }
      }
      // (simply add the quantity)
      else {
        item.quantity = (item.quantity ?? 0) + delta;
        session.itemChange(item);
      }

    }
  };

  // ⚠️ LIMITATIONS:
  // ASSUMES THE SAME ITEM ISNT ADDED IN MULTIPLE TIMES
  // ONLY ALLOWS FOR CHECKING/SUBTRACTING FOR 1 TYPE OF STACKABLE TOOL, NOT 2 OR MORE

  chain.specificAffordable = () => {
    if (chain.canAfford === undefined){
      const affordTable = new Map<Item | undefined, boolean>();
      chain.getExisting().forEach(({ item, delta, name }) => {
        if(item === undefined){
          item = { ...(allItems.find(i=>i.name === name) as Item), quantity: 0 } as Item;
        }
        affordTable.set(item, (
          delta === 0 ||
          (item.quantity !== undefined
            && item.quantity >= delta)
        ))}
      );
      chain.canAfford = affordTable;
    }
    return chain.canAfford;
  };

  chain.affordable = () => {
    const affordTable = Array.from(chain.specificAffordable().entries());
    return affordTable.every(([_item, bool])=>bool);
  };

  chain.take = () => {
    if (chain.affordable()) {
      let cleanUp = false;
      chain.getExisting().forEach(({ item, delta }) => {
        if (delta === 0) return;
        if (!item) return;
        item.quantity = (item.quantity ?? 0) - delta;
        if ((item.quantity ?? 0) <= 0) cleanUp = true;
        session.itemChange(item);
      });

      // session inventory filter items that are 0 qt
      if (cleanUp) {
        session.inventory = session.inventory.filter(item => (item.quantity ?? 0) > 0);
      }

      // unknown if still affordable!
      delete chain.canAfford;
    }
  };

  return (chain as ItemFlow);
};

export const getBaseItems = (cmd)=>{
  return ItemCmd({cmd}).getQuantities();
}