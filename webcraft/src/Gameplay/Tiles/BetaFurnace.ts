
import { Table } from "./Table";

export class BetaFurnace extends Table {
    texture?: string = "https://tse4.mm.bing.net/th/id/OIP.8fEvuhLMjvdLY279fL6oQAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    
    header: string = '🔥 Smelt Metal (TEMPORARY)';
    menu: string = 'beta furnace';
    menuType: string = 'recipes';
    
    health: number = 5;
    breakType: 'stone' | 'wood' | 'metal' = 'stone';
    drops(){return`beta furnace (1)`;}

    constructor(coords){super(coords)}
}
