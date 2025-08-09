
import { tilePreview } from "../Tiles/TileLibrary";

export type Item = {
    name: string;
    icon: string;
    quantity?: number;
    itemType?: string;
    slotId?: string;

    structure?: string;
    tilePreview?: string;
    // %! BPS(196) GIVE DATA ON WHAT STRUCTURE IT PLACES
};


export const MaterialTable: Item[] = [
    {
        name: "wood",
        icon:"https://tse2.mm.bing.net/th/id/OIP.SHwxfTNu52nxwioUggM9JwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
        name: "stone",
        icon:"https://cdn.shopify.com/s/files/1/1027/4949/products/fz7v40r0zyobl19vsat3_3315x3000.jpg?v=1578504079"
    },
    {
        name: "coal",
        icon:"https://tse4.mm.bing.net/th/id/OIP.mAx4f1uTISRl_XHHyweWZQHaGM?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        name: "metal",
        icon:"https://www.smetals.co.uk/wp-content/uploads/2023/04/3mm-mild-steel-sheet-metal-image.jpg"
    },
    {
        name: "metal ore",
        icon:"https://i.pinimg.com/originals/3f/6e/d0/3f6ed0a78397d54054b8d3f04ccf1ae1.jpg"
    }
].map(item=>{(item as Item).itemType = 'material'; return item});


// %! BPS(196) GIVE DATA ON WHAT STRUCTURE IT PLACES
export const StructureTable: Item[] = [
    {
        name: "pine cone",
        icon:"https://tse3.mm.bing.net/th/id/OIP.gm5pLYXg2eMR6gCZGntHWAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
        name: "tree",
        icon:""
    },
    {
        name: "forest",
        icon:""
    },
    {
        name: "rock",
        icon:""
    },
    {
        name: "coal ore rock",
        icon:""
    },
    {
        name: "metal ore rock",
        icon:""
    },
    {
        name: "brick house",
        icon: "https://www.homestratosphere.com/wp-content/uploads/2018/07/red-brick-exterior-home2018-07-06-at-1.44.50-PM-12.jpg",
        structure: "BrickHouse"
    }
].map(item=>{
    (item as Item).itemType = 'structure';
    const tilename = item.structure;
    if(tilename){
        item.tilePreview = tilePreview({tilename});
    }
    return item;
});


export const allItems: Item[] = [...MaterialTable, ...StructureTable];

// maybe add a ToolTable?

export const itemAbout = {
    MaterialTable, StructureTable, allItems
};

