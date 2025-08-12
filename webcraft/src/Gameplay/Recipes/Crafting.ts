

import "../Items/Items";
import { Item } from "../Items/Items";
import { PlaySession } from "../Simulator/PlaySession";

const CookBook:Record<string, Recipe>={};
const Categories:Record<string, Recipe[]>={};

export type Recipe={
    recipeId?: string;
    tables?: string[];

    // item name
    // will map to itemslotIds on output!
    input?: string[];

    // list out the materials that will subtracted
    cost: string;
    materials?: [Item, number][];
    totalCost?: [Item, number][];

    conditional?: ((session: PlaySession, ...targets:Item[])=>{success: boolean, result?: string});

    // by default, its the first item if output is a string, otherwise it needs to be set
    recipeName?: string;
    outputURL?: string;
    outputProfile?: string;
    outputCount?: number;

    // a give command, or some way to transform it like adding durability to the tool inputed
    output?: string | ((session: PlaySession, ...targets:Item[])=>Item[]);
}

import { UnderSession } from "../Routes/UponSession";
import { giveCommand, interpretQuantities } from "../Items/ItemGive";
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

            recipe.materials = interpretQuantities(recipe.cost);

            let totalCost = recipe.cost;
            if(recipe.input){
                totalCost = [...recipe.input, totalCost].join(' (1), ');
            }
            recipe.totalCost = interpretQuantities(totalCost);

            if(!recipe.outputProfile && typeof recipe.output === 'string'){
                const qt = interpretQuantities(recipe.output);
                if(qt.length > 0){
                    // set the profile to the first item of the output
                    recipe.outputProfile = qt[0][0].name;
                    recipe.outputCount = qt[0][1];
                }
            }
            if(recipe.outputProfile){
                recipe.outputURL = interpretQuantities(recipe.outputProfile)[0][0].icon;
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

export const requestMenu = UnderSession(async(session, clientSide, {tableType, tileId})=>{
    if(clientSide && session){
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

export const craftRequest = UnderSession(async(session, clientSide, {tableType, recipeId, tileId})=>{
    if(clientSide && session){
        // verify the session's tileId-tileBucket has the workbench type its claiming to have
        if(!verifyTable(session, tileId, tableType)){return{success: false, result: 'permissions not met!'}}

        const recipe = CookBook[recipeId];
        if(recipe && recipe.tables?.includes(tableType)){
            let targets: Item[] = [];
            if(recipe.input){
                targets = recipe.input.map(input=>{
                    return session.inventory.find(item=>item.name === input);
                });
                // doesn't have the required targets!
                if(targets.find(t=>t===undefined)){return{success:false, result:'not enough materials!'}}
            }

            // CHECK THE INVENTORY IF THEY HAVE ENOUGH OF ALL ON SERVER SIDE
            const subtractCost:(()=>void)[] = [];
            if(recipe.cost){
                // THIS ALSO ASSUMES YOU HAVENT MISTAKENLY PUT THE SAME ITEM IN TWICE FOR THE COST
                for(const[itemBase, qt] of recipe.materials){
                    if(itemBase.itemType === 'breakTool' && qt > 1){
                        throw new Error('CANT REQUEST OUT MORE THAN 1 OF A NONSTACKABLE!');
                    }
                    const found = session.inventory.find(item=>item.name===itemBase.name);
                    if(found && found.quantity >= qt){
                        subtractCost.push(()=>{
                            found.quantity-=qt;
                            session.itemChange(found);
                        });
                        continue;
                    }
                    else{return{success: false, result: 'not enough materials!'}}
                };
            }

            if(recipe.conditional){
                const{success, result} = recipe.conditional(session, ...targets);
                if(!success)return{success, result};
            }
            // THEN SUBTRACT AFTERWARDS
            subtractCost.forEach(subtracter=>subtracter());
            
            const output = recipe.output;
            if(typeof output === 'string'){
                await giveCommand(session, output);
            }else if(typeof output === 'function'){
                output(session, ...targets).forEach(updatedItem=>session.itemChange(updatedItem));
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