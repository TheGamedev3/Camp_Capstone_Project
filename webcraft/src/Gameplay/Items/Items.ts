

// Server Sided logic
import { tilePreview } from "../Tiles/TileLibrary";
import { Item, StructureTable } from "./ItemsClient";

StructureTable.map(item=>{
    (item as Item).itemType = 'structure';
    const name = item.structure;
    if(name){
        item.tilePreview = tilePreview({name});
    }
    return item;
});

export * from "./ItemsClient";