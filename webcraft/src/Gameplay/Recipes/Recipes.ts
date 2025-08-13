

import { exposeToTable } from "./Crafting";
import { spawnStructure } from "../Routes/Build";

let created = false;
export function createRecipes(){
    if(created)return; created = true;

    exposeToTable('default',
        {
            recipeId: 'stone-axe-upgrade',
            cost:"wood axe, wood (5), stone (5)",
            output:"stone axe"
        },
        {
            recipeId: 'stone-pickaxe-upgrade',
            cost:"wood pickaxe, wood (5), stone (5)",
            output:"stone pickaxe"
        },
        {
            recipeId: 'heal-stone-axe',
            input:['stone axe'],
            cost:"stone (3)",

            conditional({targets}){
                const stone_axe = targets[0];
                if(stone_axe.tool!.currentDurability === undefined || stone_axe.tool!.currentDurability === metal_axe.tool.durability){
                    return{success: false, result:'axe already at full durability!'}
                }
                return{success: true}
            },
            recipeName: "➕ repair stone axe",
            outputProfile: "stone axe",
            output({targets}){
                // restore it back to fullhp
                const stone_axe = targets[0];
                stone_axe.tool!.currentDurability = stone_axe.tool.durability;
                return[stone_axe];
            }
        },
        {
            recipeId: 'heal-stone-pickaxe',
            input:['stone pickaxe'],
            cost:"stone (3)",

            conditional({targets}){
                const stone_pickaxe = targets[0];
                if(stone_pickaxe.tool!.currentDurability === undefined || stone_pickaxe.tool!.currentDurability === metal_pickaxe.tool.durability){
                    return{success: false, result:'pickaxe already at full durability!'}
                }
                return{success: true}
            },

            recipeName: "➕ repair stone pickaxe",
            outputProfile: "stone pickaxe",
            output({targets}){
                // restore it back to fullhp
                const stone_pickaxe = targets[0];
                stone_pickaxe.tool!.currentDurability = stone_pickaxe.tool.durability;
                return[stone_pickaxe];
            }
        },

        {
            recipeId: 'anvil',
            cost:"metal (7)",
            output:"anvil (1)"
        },
        {
            recipeId: 'beta-furance',
            cost:"stone (8)",
            output:"beta furnace (1)"
        },
        {
            recipeId: 'land',
            cost:"wood(3), stone (5)",
            output:"land"
        },
        {
            recipeId: 'electronicsStore',
            cost:"metal (10)",
            output:"electronics store"
        },
    );

    exposeToTable('anvil',
        
        {
            recipeId: 'metal-axe-upgrade',
            cost:"stone axe, wood (5), metal (5)",
            output:"metal axe"
        },
        {
            recipeId: 'metal-pickaxe-upgrade',
            cost:"stone pickaxe, wood (5), metal (5)",
            output:"metal pickaxe"
        },
        {
            recipeId: 'wrench',
            cost:"metal (20)",
            output:"wrench"
        },

        {
            recipeId: 'heal-metal-axe',
            input:['metal axe'],
            cost:"metal (3)",

            conditional({targets}){
                const metal_axe = targets[0];
                if(metal_axe.tool!.currentDurability === undefined || metal_axe.tool!.currentDurability === metal_axe.tool.durability){
                    return{success: false, result:'axe already at full durability!'}
                }
                return{success: true}
            },
            recipeName: "➕ repair metal axe",
            outputProfile: "metal axe",
            output({targets}){
                // restore it back to fullhp
                const metal_axe = targets[0];
                metal_axe.tool!.currentDurability = metal_axe.tool.durability;
                return[metal_axe];
            }
        },
        {
            recipeId: 'heal-metal-pickaxe',
            input:['metal pickaxe'],
            cost:"metal (3)",

            conditional({targets}){
                const metal_pickaxe = targets[0];
                if(metal_pickaxe.tool!.currentDurability === undefined || metal_pickaxe.tool!.currentDurability === metal_pickaxe.tool.durability){
                    return{success: false, result:'pickaxe already at full durability!'}
                }
                return{success: true}
            },

            recipeName: "➕ repair metal pickaxe",
            outputProfile: "metal pickaxe",
            output({targets}){
                // restore it back to fullhp
                const metal_pickaxe = targets[0];
                metal_pickaxe.tool!.currentDurability = metal_pickaxe.tool.durability;
                return[metal_pickaxe];
            }
        },
        {
            recipeId: 'heal-wrench',
            input:['wrench'],
            cost:"metal (3)",

            conditional({targets}){
                const wrench = targets[0];
                if(wrench.tool!.currentDurability === undefined || wrench.tool!.currentDurability === wrench.tool.durability){
                    return{success: false, result:'pickaxe already at full durability!'}
                }
                return{success: true}
            },

            recipeName: "➕ repair wrench",
            outputProfile: "wrench",
            output({targets}){
                // restore it back to fullhp
                const wrench = targets[0];
                wrench.tool!.currentDurability = wrench.tool.durability;
                return[wrench];
            }
        }
    );

    // %! TTL(222)
    exposeToTable('land',
        {
            recipeId: 'forest',
            cost:"pine cone (10), wood (15)",
            // output:"forest" // %! TTL(224)
            // perhaps have land actually convert the tile to forest or mountain?
            // that move would require more infrastructure though and a conditional, keep it as this as temporary
            // focus on adding the tiles in first
            outputProfile:"forest",
            output({session, tileId, tableType}){
                // transform the land into a forest
                const land = session.tileBucket[tileId].find(tile=>tile.menu === tableType)
                land?.deleteSelf();
                spawnStructure(session, {what:"Forest", tileId});
                session.tileChange(tileId);
                return[];
            }
        },
        {
            recipeId: 'mountain',
            cost:"stone (20)",
            outputProfile:"mountain",
            output({session, tileId, tableType}){
                // transform the land into a forest
                const land = session.tileBucket[tileId].find(tile=>tile.menu === tableType)
                land?.deleteSelf();
                spawnStructure(session, {what:"Mountain", tileId});
                session.tileChange(tileId);
                return[];
            }
        }
    );
    exposeToTable('mountain',
        {
            recipeId: 'mineshaft',
            cost:"wood (20), stone (20)",
            outputProfile:"mineshaft",
            output({session, tileId, tableType}){
                // transform the land into a forest
                const land = session.tileBucket[tileId].find(tile=>tile.menu === tableType)
                land?.deleteSelf();
                spawnStructure(session, {what:"Mineshaft", tileId});
                session.tileChange(tileId);
                return[];
            }
        },
    );
    
    exposeToTable('electronics store',
        {
            recipeId: 'lumbermill',
            cost:"wood (10), metal (10)",
            output:"lumber mill"
        },
        {
            recipeId: 'drill',
            cost:"metal (15)",
            output:"drill"
        }
    );

    exposeToTable('beta furnace',
        {
            recipeId: 'smelt-metal',
            cost:"coal (1), metal ore (3)",
            output:"metal (3)"
        }
    );

    // eventually add a Trade table
}