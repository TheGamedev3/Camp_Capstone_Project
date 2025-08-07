

export type Item = {
    name: string;
    icon: string;
    itemType?: string;
};


export const MaterialTable: Item[] = [
    {
        name: "wood",
        icon:"",
    },
    {
        name: "stone",
        icon:""
    },
    {
        name: "coal",
        icon:""
    },
    {
        name: "metal",
        icon:""
    },
    {
        name: "metal ore",
        icon:""
    }
].map(item=>{(item as Item).itemType = 'material'; return item});


export const StructureTable: Item[] = [
    {
        name: "pine cone",
        icon:"",
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
    }
    ,
    {
        name: "brick house",
        icon:""
    }
].map(item=>{(item as Item).itemType = 'structure'; return item});


export const allItems: Item[] = [...MaterialTable, ...StructureTable];

// maybe add a ToolTable?

export const itemAbout = {
    MaterialTable, StructureTable, allItems
};

