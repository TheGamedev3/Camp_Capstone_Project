

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

    onHover?: (tileId: string | null, tileStack: any[]) => any;
    onAction?: (tileId: string, tileStack: any[]) => Promise<any> | any;
    onEquip?: () => void;
    onUnequip?: () => void;
  }) {
    this.name = name;
    this.hoverName = hoverName ?? name;
    this.borderColor = borderColor;
    this.keybind = keybind;
    this.icon = icon;
    this.defaultTool = defaultTool;

    this.hover = (tileId: string | null, tileStack: any[]) => {
        if(onHover){
            if(this._unhover && this._hoveringTile !== tileId){this._unhover(this._hoveringTile)} // (call the unhover for previous tile)
            this._hoveringTile = tileId;
            const hoverResult = onHover(tileId, tileStack);
            this._unhover = hoverResult?.onUnhover;
            this._actionable = (hoverResult?.actionable !== false && hoverResult?.actionable !== null);
            return hoverResult;
        }
    }
    this.action = async(tileId: string, tileStack: any[])=>{if(this._actionable)return await onAction?.(tileId, tileStack)};
    this.equip = onEquip ?? (() => {});
    this.unequip = onUnequip ?? (() => {});
  }

}
