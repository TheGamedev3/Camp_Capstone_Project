

export type Item = {
    name: string;
    icon: string;
    quantity?: number;
    itemType?: string;
    slotId?: string;
    structure?: string;
    // %! BPS(196) GIVE DATA ON WHAT STRUCTURE IT PLACES
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


// %! BPS(196) GIVE DATA ON WHAT STRUCTURE IT PLACES
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
    },
    {
        name: "brick house",
        icon: "",
        structure: "BrickHouse"
    }
].map(item=>{(item as Item).itemType = 'structure'; return item});


export const allItems: Item[] = [...MaterialTable, ...StructureTable];

// maybe add a ToolTable?

export const itemAbout = {
    MaterialTable, StructureTable, allItems
};

