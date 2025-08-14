

import { MenuContextType } from "../Recipes/MenuHook";
import { ClientData } from "../Looks/UpdateHook";
type UIcontrols = MenuContextType;
export type MouseEvent={
  slotId?: string | null;
  tileId?: string | null;
  tileStack?: any[];
  ClientData?: ClientData;
  selectedItem?: unknown;

  refresh?: RefObject<Dispatch<unknown>>
  changeTool?: RefObject<Dispatch<Tool>>
} & UIcontrols;



type Item = unknown;

export class Tool {
  name: string;
  hoverName: string;
  highlight?: string;
  borderColor?: string;
  keybind?: string;
  icon: React.ComponentType<any>;
  defaultTool: boolean;
  usesItemTypeOf?: (item: Item)=>boolean;
  selectsItems: boolean = true;
  // %! PII(255) CREATE FILTER PROP HERE

  private _unhover: (tileId: string | null) => void;
  private _hoveringTile: string | null = null;
  private _actionable: boolean = true;

  constructor({
    name,
    hoverName,
    borderColor,
    keybind,
    icon = () => null,     /* fallback empty icon */
    defaultTool = false,
    selectsItems = true,
    onHover,
    onAction,
    onEquip,
    onHeld, whileHeld, onLetGo,
    holdRate = 1000,
    usesItemTypeOf,
  }: {
    name: string;
    hoverName?: string;
    borderColor?: string;
    keybind?: string;
    icon?: React.ComponentType<any>;
    defaultTool?: boolean;
    selectsItems?: boolean;

    onEquip?: (args: UIcontrols) => void | (()=>void);

    onHover?: (args: MouseEvent) => any;
    onAction?: (args: MouseEvent) => Promise<any> | any;

    onHeld?: (args: MouseEvent) => Promise<any> | any;
    whileHeld?: (args: MouseEvent) => Promise<any> | any;
    onLetGo?: (args: MouseEvent) => Promise<any> | any;
    holdRate: number;

    usesItemTypeOf?: (item: Item)=>boolean;
  }) {
    this.name = name;
    this.hoverName = hoverName ?? name;
    this.borderColor = borderColor;
    this.keybind = keybind;
    this.icon = icon;
    this.defaultTool = defaultTool;
    this.selectsItems = selectsItems;

    // %! PII(255) PASS FILTER PROP HERE
    this.usesItemTypeOf = usesItemTypeOf;

    function fitMouseEvent(mouseEvent: MouseEvent){
      const {slotId, ClientData} = mouseEvent;
      if(slotId){
        const item = ClientData?.inventory?.find(item=>item.slotId===slotId);
        // pass in the most up to date selected item
        if(item){
          mouseEvent.selectedItem = item;
        }else{
          delete mouseEvent.slotId;
        }
      }
    }

    this.onHeld = onHeld;
    this.whileHeld = whileHeld;
    this.onLetGo = onLetGo;
    this.holdRate = holdRate;

    this.hover = (mouseEvent: MouseEvent) => {
      fitMouseEvent(mouseEvent);
      const {tileId} = mouseEvent;
      if(onHover){
          if(this._unhover && this._hoveringTile !== tileId){this._unhover(this._hoveringTile)} // (call the unhover for previous tile)
          this._hoveringTile = tileId;
          // %! BPS(193) PASS ARGS AS STRUCT TO ALLOW FOR slotId
          const hoverResult = onHover(mouseEvent);
          this._unhover = hoverResult?.onUnhover;
          this._actionable = (hoverResult?.actionable !== false && hoverResult?.actionable !== null);
          return hoverResult;
      }
    };
    // %! BPS(193) PASS ARGS AS STRUCT TO ALLOW FOR slotId
    this.action = async(mouseEvent: MouseEvent)=>{
      fitMouseEvent(mouseEvent);
      if(this._actionable)return await onAction?.(mouseEvent);
    };
    this.equip = onEquip ?? (() => {});

    // %! BPS(193) TOOL CAN SELECT ITEM OR NOT?
  }

}
