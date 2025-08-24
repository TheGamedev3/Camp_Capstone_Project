

/*
(trade)=>
Cancel / Claim
    >Claiming...
    >Refunding...

Can't Afford! / Exchange?
    >Exchanging...
*/

import { useSession } from "@/components/RootType/UserSession";
import { SubmitBtn, Requester } from "@Req";
import { useState } from "react";

type Tone = "green" | "red";

const BTN: Record<Tone, {
  base: string;
  hover: string;
  disabled: string;
  pending: string;
}> = {
  green: {
    base: "bg-green-500",
    hover: "hover:bg-green-400",
    disabled: "bg-green-700",
    pending: "bg-green-700",
  },
  red: {
    base: "bg-red-500",
    hover: "hover:bg-red-400",
    disabled: "bg-red-700",
    pending: "bg-red-700",
  },
};

export function TradeAction({
  tradeId, sellerId, exchanged, affordable
}: { tradeId: string; sellerId: string; exchanged: boolean; affordable: boolean }) {
  const { user } = useSession();
  const [completed, setCompletion] = useState(false);

  const ownedByMe = sellerId === user._id;

  // decide label/route/tone
  let text = "", pending = "", route: string | undefined;
  let tone: Tone = "green";
  let off = false;

  if (completed) {
    pending = "completed!";
    tone = "green";
    off = true;
  } else if (ownedByMe) {
    if (exchanged) {
      text = "Claim!";
      pending = "Claiming...";
      tone = "green";
      route = `PATCH /api/trade/${tradeId}`;
    } else {
      text = "Cancel?";
      pending = "Canceling...";
      tone = "red";
      route = `DELETE /api/trade/${tradeId}`;
    }
  } else {
    if (affordable) {
      text = "Exchange?";
      pending = "Exchanging...";
      tone = "green";
      route = `PATCH /api/trade/${tradeId}`;
    } else {
      pending = "Can't Afford!";
      tone = "red";
      off = true;
    }
  }

  const disabled = off;
  const cls = BTN[tone];

  return (
    <Requester request={route} onSuccess={() => setCompletion(true)}>
      <SubmitBtn
        styling={`${disabled ? cls.disabled : cls.base} ${disabled ? "" : cls.hover} text-white px-4 py-2 rounded relative z-30 no-parent-hover`}
        pendingText={pending || text}
        pendingStyle={`${cls.pending} text-white px-4 py-2 rounded relative z-30 no-parent-hover`}
        text={text}
        disable={disabled}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      />
    </Requester>
  );
}


