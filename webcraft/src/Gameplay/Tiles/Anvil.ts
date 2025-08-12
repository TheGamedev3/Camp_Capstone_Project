
import { Table } from "./Table";

export class Anvil extends Table {
    texture?: string = "https://images-na.ssl-images-amazon.com/images/I/71s9onWvQtL.jpg";
    
    header: string = '🔨 Forage Metal';
    menu: string = 'anvil';
    menuType: string = 'recipes';

    health: number = 5;
    breakType: 'stone' | 'wood' | 'metal' = 'metal';
    drops(){return`anvil (1)`;}

    constructor(coords){super(coords)}
}
