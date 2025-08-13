

import { Tool } from './ToolBase';
import { getRoute } from '@/utils/request';
import { Info, Hammer, X, DraftingCompass } from 'lucide-react';

const tilesTaken: Record<string, boolean> = {};

export const Tools: Tool[] = [
  new Tool({
    name: 'interact',
    keybind: 'e',
    icon: Info,
    defaultTool: true,
    selectsItems: false,
    // %! PII(255) CREATE FILTER HERE
    // %! BPS(193) ACCEPT ARGS AS STRUCT TO ALLOW FOR slotId
    onHover({tileId, tileStack}){
        if(!tileId)return{actionable: false}
        const interactable = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        if(interactable?.menu){
          return{
            actionable: true,
            highlight: 'rgba(255, 123, 0, 0.9)',
          }
        }

        return{
            actionable: interactable,
            highlight: interactable ? 'rgba(255, 255, 255, 0.7)' : null,
        }
    },

    // %! C&C(173) ON CLICK, IF TILE HAS A MENU THINGY, REQUEST IT!
    // getmenu tile.name, pass info to the tile, or pull up a menu!
    // also requires a menu name...
    // USE changeTool
    onAction({tileId, tileStack, setMenu}){
        if(!tileId)return{actionable: false}
        const interactable = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        if(interactable?.menu){
          setMenu({
            header: interactable.header || 'UNNAMED',
            menuType: interactable.menuType || 'recipes',
            tableType: interactable.menu,
            tileId, sendRequest: true
          });
        }
    }
  }),
  new Tool({
    name: 'build',
    keybind: 't',
    icon: Hammer,
    borderColor: 'border-blue-500',
    usesItemTypeOf:(item)=>(item.itemType === "structure" && item.structure),
    // %! PII(255) CREATE FILTER HERE
    // %! BPS(193) ACCEPT ARGS AS STRUCT TO ALLOW FOR slotId
    onHover({selectedItem, tileId, tileStack}){
        if(!tileId)return{actionable: false}
        const collision = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        
        
        // %! BPS(199) GHOST TILE PREVIEW OF ITEM
        // REQUIRES:
        // GETTING INVENTORY
        // GETTING STRUCTURE HOVER TILE DATA IN ADVANCED
        // JOINING IT WITH THE REST OF THE TILE

        const actionable = selectedItem && !collision;
        return{
            actionable,
            highlight: actionable ? 'rgba(0, 255, 34, 0.7)' : 'rgba(136, 0, 0, 0.7)',
            hoverTile: selectedItem ? {...selectedItem.tilePreview, key:tileId} : null // (w/ a default transparency of 40)
        }
    },

    // %! BPS(193) ACCEPT ARGS AS STRUCT TO ALLOW FOR slotId
    async onAction({ClientData, selectedItem, slotId, tileId, tileStack, pushLocalItemChange, pushLocalTileChange}){
        if(!tileStack || !selectedItem || !ClientData)return;
        const collision = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        if(collision || tilesTaken[tileId]){return}

        tilesTaken[tileId] = true;

        // %! BPS(200) CLIENT SIDE QUICK PLACE (AND QUICK SUBTRACT MAYBE?)
        // instantly temporarily place the preview down while waiting for the server response
        let changeA = null; let changeB = null;
        if(selectedItem?.tilePreview){
          // %! PII(252/253)
          selectedItem.quantity -= 1;
          // %! STT(130) ALSO REMOVE DURABILITY 0% ITEMS

          changeA = pushLocalItemChange(selectedItem);
          changeB = pushLocalTileChange(tileId, selectedItem.tilePreview);
        }

        const eventData = await getRoute({route: "POST /api/build", body: {slotId, tileId}});
        changeA?.unmount();
        changeB?.unmount();
        delete tilesTaken[tileId];
        return eventData;
    }
  }),
  new Tool({
    name: 'break',
    keybind: 'b',
    icon: X,
    borderColor: 'border-red-500',
    usesItemTypeOf:(item)=>(item.itemType === "breakTool"),
    // %! PII(255) CREATE FILTER HERE
    // %! BPS(193) ACCEPT ARGS AS STRUCT TO ALLOW FOR slotId
    onHover({tileId, tileStack}){
        if(!tileId)return{actionable: false}
        const breakTarget = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        return{
            actionable: breakTarget,
            highlight: breakTarget ? 'rgba(239, 68, 68, 0.7)' : null
        }
    },

    // %! BPS(193) ACCEPT ARGS AS STRUCT TO ALLOW FOR slotId
    async onAction({tileId, tileStack, slotId}){
        if(!tileStack)return;
        const breakTarget = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        if(!breakTarget){return}

        const eventData = await getRoute({route: "DELETE /api/break", body: {slotId, tileId}});
        return eventData;
    }
  }),
  new Tool({
    name: 'crafting',
    keybind: 'f',
    icon: DraftingCompass,
    borderColor: 'border-orange-500',
    
    onEquip({ menu, setMenu }){
      if(menu === null){
        setMenu({
          header: 'Craft',
          menuType: 'recipes',
          tableType: 'default',
          tileId: '',
          sendRequest: true
        });
      }
      return()=>setMenu(null);
    }
  }),
];

export const defaultTool = Tools.find(t => t.defaultTool) ?? Tools[0];
