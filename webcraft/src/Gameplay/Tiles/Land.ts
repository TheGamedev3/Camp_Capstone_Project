
import { Table } from "./Table";

export class Land extends Table {
    texture?: string = "https://tse1.mm.bing.net/th/id/OIP.RrKtEYN72QSiaBlcTEzntgHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    
    header: string = '🗺️🏖️ Explore the Wilderness!';
    menu: string = 'land';
    menuType: string = 'recipes';
    
    health: number = 10;
    breakType: 'stone' | 'wood' | 'metal' = 'wood';
    drops(){return`land (1)`;}

    constructor(coords){super(coords)}
}
