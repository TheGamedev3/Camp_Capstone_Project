

// Server Sided logic
import { tilePreview } from "../Tiles/TileLibrary";
import { Item, StructureTable } from "./ItemsClient";

export function addTilePreviews(){
    StructureTable.forEach(item=>{
        (item as Item).itemType = 'structure';
        const name = item.structure;
        if(name){
            item.tilePreview = tilePreview({name});
        }
    });
}

export * from "./ItemsClient";