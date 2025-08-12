

import { exposeToTable } from "./Crafting";

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
            recipeId: 'forest',
            cost:"pine cone (10), wood (15)",
            output:"forest"
        },
        {
            recipeId: 'mountain',
            cost:"stone (20)",
            output:"mountain"
        },
        {
            recipeId: 'mineshaft',
            cost:"mountain, wood (20), stone (20)",
            output:"mineshaft"
        },

        {
            recipeId: 'smelt-metal',
            cost:"coal (1), metal ore (3)",
            output:"metal (3)"
        },

        /* DOESNT EXIST YET
        {
            recipeId: 'anvil',
            cost:"metal (20)",
            output:"anvil"
        },
        */
        {
            recipeId: 'wrench',
            cost:"metal (20)",
            output:"wrench"
        },

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
    );





    exposeToTable('Anvil',
        {
            recipeId: 'heal-metal-axe',
            input:['metal axe'],
            cost:"metal (3)",

            conditional(_, metal_axe){
                if(metal_axe.tool!.currentDurability === undefined || metal_axe.tool!.currentDurability === metal_axe.tool.durability){
                    return{success: false, result:'axe already at full durability!'}
                }
                return{success: true}
            },
            outputProfile: "metal axe",
            output:(session, metal_axe)=>{
                // restore it back to fullhp
                metal_axe.tool!.currentDurability = metal_axe.tool.durability;
                session.itemChange(metal_axe);
            }
        },
        {
            recipeId: 'heal-metal-pickaxe',
            input:['metal pickaxe'],
            cost:"metal (3)",

            conditional(_, metal_pickaxe){
                if(metal_pickaxe.tool!.currentDurability === undefined || metal_pickaxe.tool!.currentDurability === metal_pickaxe.tool.durability){
                    return{success: false, result:'pickaxe already at full durability!'}
                }
                return{success: true}
            },

            outputProfile: "metal pickaxe",
            output:(session, metal_pickaxe)=>{
                // restore it back to fullhp
                metal_pickaxe.tool!.currentDurability = metal_pickaxe.tool.durability;
                session.itemChange(metal_pickaxe);
            }
        },
        {
            recipeId: 'heal-wrench',
            input:['wrench'],
            cost:"metal (3)",

            conditional(_, wrench){
                if(wrench.tool!.currentDurability === undefined || wrench.tool!.currentDurability === wrench.tool.durability){
                    return{success: false, result:'pickaxe already at full durability!'}
                }
                return{success: true}
            },

            outputProfile: "wrench",
            output:(session, wrench)=>{
                // restore it back to fullhp
                wrench.tool!.currentDurability = wrench.tool.durability;
                session.itemChange(wrench);
            }
        }
    );

}