

import { Tool } from './ToolBase';
import { getRoute } from '@/utils/request';
import { Info, Hammer, X } from 'lucide-react';

export const Tools: Tool[] = [
  new Tool({
    name: 'interact',
    keybind: 'e',
    icon: Info,
    defaultTool: true,
    onHover(tileId: string | null, tileStack: any[]){
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
    onHover(tileId: string, tileStack: any[]){
        if(tileId === null)return{actionable: false}
        const collision = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        return{
            actionable: !collision,
            highlight: !collision ? 'rgba(0, 255, 34, 0.7)' : 'rgba(136, 0, 0, 0.7)',
            hoverTile: {structure: "BrickHouse"} // (w/ a default transparency of 40)
        }
    },

    async onAction(tileId: string, tileStack: any[]){
        if(!tileStack)return;
        const collision = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        if(collision){return}

        const tileUpdate = await getRoute({route: "POST /api/build", body: {what: "BrickHouse", tileId}});
        return{tileUpdate};
    }
  }),
  new Tool({
    name: 'break',
    keybind: 'b',
    icon: X,
    borderColor: 'border-red-500',
    onHover(tileId: string, tileStack: any[]){
        if(tileId === null)return{actionable: false}
        const breakTarget = tileStack.find(tileDatum=>tileDatum.layer === "structure");

        return{
            actionable: breakTarget,
            highlight: breakTarget ? 'rgba(239, 68, 68, 0.7)' : null
        }
    },

    async onAction(tileId: string, tileStack: any[]){
        if(!tileStack)return;
        const breakTarget = tileStack.find(tileDatum=>tileDatum.layer === "structure");
        if(!breakTarget){return}

        const tileUpdate = await getRoute({route: "DELETE /api/break", body: {tileId, tool: "wooden_axe"}});
        return{tileUpdate};
    }
  }),
];


export const defaultTool = Tools.find(t => t.defaultTool) ?? Tools[0];
