

export type MouseEvent={
  slotId?: string | null;
  tileId?: string | null;
  tileStack?: any[];
  GameData?: unknown;
  selectedItem?: unknown;
  refresh?: RefObject<Dispatch<unknown>>
}

export class Tool {
  name: string;
  hoverName: string;
  highlight?: string;
  borderColor?: string;
  keybind?: string;
  icon: React.ComponentType<any>;
  defaultTool: boolean;

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
    onHover,
    onAction,
    onEquip,
    onUnequip,
  }: {
    name: string;
    hoverName?: string;
    borderColor?: string;
    keybind?: string;
    icon?: React.ComponentType<any>;
    defaultTool?: boolean;

    onHover?: (args: MouseEvent) => any;
    onAction?: (args: MouseEvent) => Promise<any> | any;
    onEquip?: () => void;
    onUnequip?: () => void;
  }) {
    this.name = name;
    this.hoverName = hoverName ?? name;
    this.borderColor = borderColor;
    this.keybind = keybind;
    this.icon = icon;
    this.defaultTool = defaultTool;

    function fitMouseEvent(mouseEvent: MouseEvent){
      const {slotId, GameData} = mouseEvent;
      if(slotId){
        const item = GameData?.inventory?.find(item=>item.slotId===slotId);
        // pass in the most up to date selected item
        if(item){
          mouseEvent.selectedItem = item;
        }else{
          delete mouseEvent.slotId;
        }
      }
    }

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
    this.unequip = onUnequip ?? (() => {});

    // %! BPS(193) TOOL CAN SELECT ITEM OR NOT?
  }

}
