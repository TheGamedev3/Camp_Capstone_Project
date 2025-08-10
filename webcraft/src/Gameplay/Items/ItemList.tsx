
import { useEffect, useLayoutEffect, useRef } from "react";
import Slot from "./Slot";

import { useInventory } from "./InventoryHook";
import { useTools } from "../Tools/ToolHook";
import { Tools } from "../Tools/Tools";

const[interact, builder, breaker] = Tools;
const properTools = {
  'material': undefined, 'structure': builder, 'breakTool': breaker
}

export function ItemList() {
  const{relevantItems, selectedSlot} = useInventory();

  // preserve scroll position across re-renders
  const scrollRef = useRef<HTMLDivElement>(null);
  const savedScrollTop = useRef(0);
  const prevScrollHeight = useRef(0);

  // Track scrollTop continuously (so we always have the latest)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => { savedScrollTop.current = el.scrollTop; };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Restore scrollTop after content changes.
  // If height changed a lot, restore by ratio so the viewport feels consistent.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const oldHeight = prevScrollHeight.current || el.scrollHeight;
    const ratio = oldHeight ? savedScrollTop.current / oldHeight : 0;

    // Next frame after DOM paints
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      const newHeight = scrollRef.current.scrollHeight;
      const byRatio = Math.round(ratio * newHeight);

      // Prefer ratio when list height changed; fall back to absolute if similar
      const heightChangedALot = Math.abs(newHeight - oldHeight) > 8;
      scrollRef.current.scrollTop = heightChangedALot ? byRatio : savedScrollTop.current;

      prevScrollHeight.current = newHeight;
    });
  }, [relevantItems]); // re-run when list content order/size changes

  // %! BPS(192) SELECT UI
  // %! PII(261) SCROLLBAR AND HANDLE OVERFLOW
  // %! PII(259) NEW SLOT COMPONENT
// Grid (centered, fixed-height, N columns always square)
  const rowLength = 8;        // number of squares per row
  const slotPx    = 80;       // matches w-20 (80px)
  const gapPx     = 8;        // Tailwind gap-2 = 0.5rem ≈ 8px
  const heightPx  = 200;

  const { selectedTool, equipTool, setSlot } = useTools();
  return (
    <aside className="fixed left-0 bottom-0 w-full flex justify-center pb-2">
      <div className="w-full flex justify-center">
        <div
          ref={scrollRef}
          style={{
            // fixed bar geometry
            maxHeight: `${heightPx}px`,
            width: `${rowLength * slotPx + (rowLength - 1) * gapPx}px`,
            minHeight: `${slotPx+gapPx*2}px`,                 // ← keep height as if one square exists
            // layout math handled by flex
            display: "flex",
            flexWrap: "wrap",
            gap: `${gapPx}px`,
            justifyContent: "center",                 // ← center items per row
            alignContent: "flex-start",
          }}
          className="overflow-auto rounded bg-neutral-800 p-2"
        >
          {relevantItems.map((item) => {
            const isSelected = item.slotId === selectedSlot;
            return(
              <Slot
                key={item.slotId}
                selected={isSelected}
                onClick={()=>{
                  
                  // unselect
                  if(isSelected && selectedTool !== interact){
                    equipTool(interact);
                    setSlot('');
                    return;
                  }

                  // select slot & tool
                  const toolOfChoice = properTools[item.itemType];
                  if(!toolOfChoice)return;
                  if(selectedTool !== toolOfChoice){
                    equipTool(toolOfChoice);
                  }
                  setSlot(item.slotId);
                }}
                {...item}
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}

// (eventually each slot will be its own component with its own hook)
