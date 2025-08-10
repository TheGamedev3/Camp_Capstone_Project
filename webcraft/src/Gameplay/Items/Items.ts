
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
        structure: "PineTree"
    },
    {
        name: "tree",
        icon:""
    },
    {
        name: "forest",
        icon:"https://tse2.mm.bing.net/th/id/OIP.Gs0tJU3w2iFeE-zC63gh2gHaE6?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        structure: "Forest"
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
    },
    {
        name: "lumber mill",
        icon: "https://tse2.mm.bing.net/th/id/OIP.rXHMZ6ZqHWNqSnfXQwhcywHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        structure: "Lumbermill"
    },
    {
        name: "drill",
        icon: "https://th.bing.com/th/id/R.2d733f8a457e3863529293f0503bd5e9?rik=AFEdiOlIJHzFRw&pid=ImgRaw&r=0",
        structure: "Drill"
    },
    {
        name: "mountain",
        icon: "https://th.bing.com/th/id/R.a4135f38639d7f8c71d08731c6225ec2?rik=wGokmSuSKxk%2fOQ&pid=ImgRaw&r=0",
        structure: "Mountain"
    },
    {
        name: "mineshaft",
        icon: "https://th.bing.com/th/id/R.02b16a23b74028b45938e1faa377bbc9?rik=PzRRvkfu%2bBODQw&riu=http%3a%2f%2fi.imgur.com%2fzPvdz.jpg&ehk=rEQ4U7SDvBUCwcBJSVJyCH6b3JH75DtSNJYqFrmOoKw%3d&risl=&pid=ImgRaw&r=0",
        structure: "Mineshaft"
    }
].map(item=>{
    (item as Item).itemType = 'structure';
    const name = item.structure;
    if(name){
        item.tilePreview = tilePreview({name});
    }
    return item;
});


export const allItems: Item[] = [...MaterialTable, ...StructureTable];

// maybe add a ToolTable?

export const itemAbout = {
    MaterialTable, StructureTable, allItems
};

