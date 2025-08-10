

import { Tool } from './ToolBase';
import { getRoute } from '@/utils/request';
import { Info, Hammer, X } from 'lucide-react';

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
        if(tileId === null)return{actionable: false}
        const interactable = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        return{
            actionable: interactable,
            highlight: interactable ? 'rgba(255, 255, 255, 0.7)' : null,
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
        if(tileId === null || !selectedItem)return{actionable: false}
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
            hoverTile: {...selectedItem.tilePreview, key:tileId} // (w/ a default transparency of 40)
        }
    },

    // %! BPS(193) ACCEPT ARGS AS STRUCT TO ALLOW FOR slotId
    async onAction({GameData, refresh, selectedItem, slotId, tileId, tileStack}){
        if(!tileStack || !selectedItem || !GameData)return;
        const collision = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        if(collision){return}

        // %! BPS(200) CLIENT SIDE QUICK PLACE (AND QUICK SUBTRACT MAYBE?)
        // instantly temporarily place the preview down while waiting for the server response
        if(selectedItem?.tilePreview){
          // %! PII(252/253)
          selectedItem.quantity -= 1;
          // %! STT(130) ALSO REMOVE DURABILITY 0% ITEMS
          GameData.inventory = GameData.inventory.filter(item=>{
            if(item.quantity === 0)return false;
            if(item.tool && item.tool.durability !== 'infinite' && item.tool.currentDurability <= 0)return false;
            return true;
          });
          GameData.tileBucket[tileId].push(selectedItem.tilePreview);
          refresh({...GameData});
        }

        const eventData = await getRoute({route: "POST /api/build", body: {slotId, tileId}});
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
        if(tileId === null)return{actionable: false}
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
];

export const defaultTool = Tools.find(t => t.defaultTool) ?? Tools[0];
