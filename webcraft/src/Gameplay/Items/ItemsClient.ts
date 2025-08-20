
export type Item = {
    name: string;
    icon: string;
    quantity?: number;
    itemType?: 'material' | 'structure' | 'breakTool';
    slotId?: string;

    // %! BPS(196) GIVE DATA ON WHAT STRUCTURE IT PLACES
    structure?: string;
    tilePreview?: string;

    tool?: ToolStats;
};

export type ToolStats={
    durability?: number | 'infinite';
    currentDurability?: number;

    woodDmg?: number,
    stoneDmg?: number,
    metalDmg?: number,

    upgradeToItem?: string;
    upgradeCost?: string;
    downgradeToItem?: string;
}


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
        structure: "PineSappling"
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
    },

    {
        name: "anvil",
        icon: "https://images-na.ssl-images-amazon.com/images/I/71s9onWvQtL.jpg",
        structure: "Anvil"
    },
    {
        name: "beta furnace",
        icon: "https://tse4.mm.bing.net/th/id/OIP.8fEvuhLMjvdLY279fL6oQAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        structure: "BetaFurnace"
    },
    {
        name: "land",
        icon: "https://tse1.mm.bing.net/th/id/OIP.RrKtEYN72QSiaBlcTEzntgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        structure: "Land"
    },
    {
        name: "electronics store",
        icon: "https://tse4.mm.bing.net/th/id/OIP.uQcCihVC3SS-OOVOL2ZqeQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        structure: "ElectronicsStore"
    }
].map(item=>{
    (item as Item).itemType = 'structure';
    return item;
});


export const ToolTable: Item[] = [
    {
        name: "wood axe",
        icon:"https://i.etsystatic.com/12915054/r/il/34a0dd/1462561723/il_794xN.1462561723_5h64.jpg",
        tool:{
            durability: 'infinite',

            woodDmg: 1,

            upgradeToItem: "stone axe",
            upgradeCost: "5 wood, 10 stone",
        }
    },
    {
        name: "wood pickaxe",
        icon:"https://www.renderhub.com/dereza/wooden-pickaxe/wooden-pickaxe-02.jpg",
        tool:{
            durability: 'infinite',

            stoneDmg: 1,
            metalDmg: 1,

            upgradeToItem: "stone axe",
            upgradeCost: "5 wood, 10 stone",
        }
    },
    {
        name: "stone axe",
        icon:"https://th.bing.com/th/id/R.acb501c861e3ba8fe4a199a134353a10?rik=f58TE6u6ftDBmQ&pid=ImgRaw&r=0",
        tool:{
            durability: 35,

            woodDmg: 2,

            upgradeToItem: "metal axe",
            upgradeCost: "5 wood, 10 metal",
            downgradeToItem: "wood axe",
        }
    },
    {
        name: "stone pickaxe",
        icon:"https://tse1.explicit.bing.net/th/id/OIP.i1xamhuhoDLr3LkML9bJjwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        tool:{
            durability: 35,

            stoneDmg: 2,
            metalDmg: 1,

            upgradeToItem: "metal axe",
            upgradeCost: "5 wood, 10 metal",
            downgradeToItem: "wood pickaxe",
        }
    },
    {
        name: "metal axe",
        icon:"https://cdn.britannica.com/93/125393-050-BA7F4807/Ax.jpg",
        tool:{
            durability: 60,

            woodDmg: 5,

            downgradeToItem: "stone pickaxe",
        }
    },
    {
        name: "metal pickaxe",
        icon:"https://th.bing.com/th/id/R.74b1d6c43a6caf37aa5ca90807f2af28?rik=9sDso8oHsShCPg&riu=http%3a%2f%2fpreview.turbosquid.com%2fPreview%2f2015%2f04%2f10__15_07_53%2f10000.jpg9e42941e-ff0e-4a80-974b-c0b8e0b542b6Original.jpg&ehk=r481%2bqlCh4WUFNH6IqAxTP0r%2fXmW0AwSrzkVF1lMSZ4%3d&risl=&pid=ImgRaw&r=0",
        tool:{
            durability: 60,

            stoneDmg: 5,
            metalDmg: 2,

            downgradeToItem: "stone pickaxe",
        }
    },
    {
        name: "wrench",
        icon:"https://m.media-amazon.com/images/I/71UQTCpwndL.jpg",
        tool:{
            durability: 60,

            metalDmg: 5,
        }
    }
].map(item=>{
    const i = (item as Item);
    i.itemType = 'breakTool';
    if(i.tool?.durability !== 'infinite'){
        i.tool.currentDurability = i.tool.durability;
    }
    return i;
});


export const allItems: Item[] = [...MaterialTable, ...StructureTable, ...ToolTable];

export const itemAbout = {
    MaterialTable, StructureTable, ToolTable, allItems
};

