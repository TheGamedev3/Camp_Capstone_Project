
import { Structure } from "./Structure";

export class Table extends Structure {
    
    header: string = '🔨 Craft Tools';
    menu: string = 'default';
    menuType: string = 'recipes';
    
    constructor(coords){super(coords)}
}
