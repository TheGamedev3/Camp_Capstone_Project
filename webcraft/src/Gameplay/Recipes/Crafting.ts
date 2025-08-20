

import "../Items/Items";
import { Item } from "../Items/Items";
import type { PlaySession } from "../Simulator/PlaySession";

const CookBook:Record<string, Recipe>={};
const Categories:Record<string, Recipe[]>={};

type evaluater = {
    session: PlaySession,
    targets:Item[],
    tileId: string,
    tableType: string
};

export type Recipe={
    recipeId?: string;
    tables?: string[];

    // item name
    // will map to itemslotIds on output!
    input?: string[];

    // list out the materials that will subtracted
    cost: string;
    totalCost?: [Item, number][];

    conditional?: ((struct:evaluater)=>{success: boolean, result?: string});

    // by default, its the first item if output is a string, otherwise it needs to be set
    recipeName?: string;
    outputURL?: string;
    outputProfile?: string;
    outputCount?: number;

    // a give command, or some way to transform it like adding durability to the tool inputed
    output?: string | ((struct:evaluater)=>Item[]);
}

import { ReqFit } from "../Routes/ReqFit";
import { ItemCmd, getBaseItems } from "../Items/ItemFlow";
import { randomBytes } from "crypto";

export function exposeToTable(tableName: string, ...recipieList:Recipe[]){
    // initially adds the recipies, and they're ids and how they're exposed via what table
    (Categories[tableName] ??= []).push(
        ...recipieList.map(template=>{

            const recipe={...template};
            if(!recipe.recipeId){
                const newId = randomBytes(16).toString('hex');
                recipe.recipeId = newId;
            }
            (recipe.tables??=[]).push(tableName);

            // (for the client to calculate)
            let totalCost = recipe.cost;
            if(recipe.input){
                totalCost = [...recipe.input, totalCost].join(' (1), ');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            recipe.totalCost = ItemCmd({cmd:totalCost}).getQuantities().map(([_name, delta, item])=>[item!, delta]);

            if(!recipe.outputProfile && typeof recipe.output === 'string'){
                const qt = getBaseItems(recipe.output);
                if(qt.length > 0){
                    // set the profile to the first item of the output
                    recipe.outputProfile = qt[0][0]; // item name
                    recipe.outputCount = qt[0][1]; // item delta
                }
            }
            if(recipe.outputProfile){
                recipe.outputURL = getBaseItems(recipe.outputProfile)[0][2].icon;
                if(!recipe.recipeName){recipe.recipeName = recipe.outputProfile}
            }else{
                throw new Error(`RECIPE ${recipe.cost} IS MISSING ITS OUTPUT PROFILE!`);
            }
            CookBook[recipe.recipeId] = recipe;
            return recipe;
        })
    );
}

function verifyTable(session: PlaySession, tileId: string, tableType: string): boolean{
    if(tableType === 'default')return true;
    const tileStack = session?.tileBucket[tileId] || [];
    return Boolean(tileStack.find(structure=>(structure.layer === 'structure' && structure.menu === tableType)));
}

type CraftInfo = {tableType: string; recipeId: string; tileId: string;}

export const requestMenu = ReqFit<CraftInfo>(({session, origin, tableType, tileId})=>{
    if(origin === 'api' && session){
        // verify the session's tileId-tileBucket has the workbench type its claiming to have
        if(!verifyTable(session, tileId, tableType)){return{success: false, result: 'permissions not met!'}}

        // evaluating will be calculated on the client side
        const recipes = Categories[tableType];
        if(!recipes){return{success:false, result: `no table type ${tableType} found!`}}
        const result = recipes.map(({recipeId, recipeName, totalCost, outputURL, outputCount})=>{
            return{
                recipeId,
                recipeName,
                totalCost,
                outputURL,
                outputCount
            }
        });
        return{success: true, result}
    }
    return{success: false, result: 'failed to verify'}
});

export const craftRequest = ReqFit<CraftInfo>(async({session, origin, tableType, recipeId, tileId})=>{
    if(origin === 'api' && session){
        // verify the session's tileId-tileBucket has the workbench type its claiming to have
        if(!verifyTable(session, tileId, tableType)){return{success: false, result: 'permissions not met!'}}

        const recipe = CookBook[recipeId];
        if(recipe && recipe.tables?.includes(tableType)){
            let targets: Item[] = [];

            // can it afford 1 of each input?
            // if so get the inputs, else error
            if(recipe.input){
                const inputChain = ItemCmd({session, cmd: recipe.input.join(' (1),')});
                if(!inputChain.affordable())return{success:false, result:'not enough materials!'}
                targets = (inputChain.getItems() as Item[]);
            }

            // check if it can afford recipe.cost
            const materialChain = ItemCmd({session, cmd: recipe.cost});
            if(!materialChain.affordable())return{success: false, result: 'not enough materials!'};

            if(recipe.conditional){
                const{success, result} = recipe.conditional({session, targets, tileId, tableType});
                if(!success)return{success, result};
            }

            // THEN SUBTRACT AFTERWARDS
            materialChain.take();
            
            const output = recipe.output;
            if(typeof output === 'string'){
                ItemCmd({session, cmd: output}).give();
            }else if(typeof output === 'function'){
                // %! TTL(224) CHANGE TARGETS TO ITEM TARGETS! AND MAKE IT A STRUCT
                // ALSO INCLUDE TILE DATA!
                output({session, targets, tileId, tableType}).forEach(updatedItem=>session.itemChange(updatedItem));
            }
            return {success: true, result: session.ejectChanges()};
        }
    }
    return{success: false, result: `couldn't find recipe ${recipeId}`}
});

import { createRecipes } from "./Recipes";
createRecipes();

// default crafting (upgrade tools)
// construction site (creates structures)
// Anvil (repair), Electronics Store
// betaFurnace (smelt)