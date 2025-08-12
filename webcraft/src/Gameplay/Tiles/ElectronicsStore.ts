
import { Table } from "./Table";

export class ElectronicsStore extends Table {
    texture?: string = "https://tse4.mm.bing.net/th/id/OIP.uQcCihVC3SS-OOVOL2ZqeQHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3";
    
    header: string = '🏭⚙️🤖 Automate The World!';
    menu: string = 'electronics store';
    menuType: string = 'recipes';
    
    health: number = 10;
    breakType: 'stone' | 'wood' | 'metal' = 'metal';
    drops(){return`electronics store (1)`;}

    constructor(coords){super(coords)}
}
