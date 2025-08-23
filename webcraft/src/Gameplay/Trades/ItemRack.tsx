

import type { Item } from "../Items/ItemsClient";
import Slot from "../Items/Slot";
import { ItemCmd } from "../Items/ItemFlow";

export default function ItemRack({itemCmd}:{itemCmd:string}){
    // use item flow to and getDeltaItems to render them out
    const Items = ItemCmd({cmd: itemCmd}).getDeltaItems().filter(Boolean) as Item[];
    return(
        <div className="w-full flex flex-wrap justify-start items-start gap-2 rounded-xl bg-neutral-800/70 p-2">
            {Items.length > 0 ? (
            Items.map((item, i) => (
                <Slot item={item} key={item.slotId ?? i} />
            ))
            ) : (
            // Placeholder the same size as a Slot: w-20 h-20
            <div
                aria-hidden
                className="w-20 h-20 shrink-0 rounded-md border bg-neutral-900/40 border-neutral-700 opacity-0 pointer-events-none"
            />
            )}
        </div>
    );
}
