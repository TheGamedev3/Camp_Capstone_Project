
// %! C&C(186) SEPARATE OUT THE INGREDENT THING

function Ingredient(){
    // use inventory hook, check if theres enough of that material
    // make it so it displays the image, and upon hover, the name
}

export function Recipe({recipeId, outputURL, outputProfile, outputCount, totalCost}){
    return(
        <div
            className="rounded-xl border border-neutral-800 p-3 bg-neutral-900/60"
        >
            {/* top row: preview + craft */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                {outputURL ? (
                    <img
                        src={outputURL}
                        alt="output"
                        className="w-8 h-8 rounded-md object-cover border border-neutral-700"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-md border border-neutral-700 bg-neutral-800/60" />
                )}

                <div className="truncate">
                    <div className="text-sm font-medium truncate">
                    {outputProfile ?? "Recipe"}
                    {typeof outputCount === "number" &&
                        ` × ${outputCount}`}
                    </div>
                    {/* cost summary, if provided */}
                    {Array.isArray(totalCost) && totalCost.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-neutral-400">
                        {totalCost.slice(0, 6).map((pair, i) => {
                        const [, need] = pair ?? [];
                        // try to show a readable label even if unknown structure
                        const name =
                            (pair?.[0] as any)?.name ??
                            (pair?.[0] as any)?.id ??
                            "item";
                        return (
                            <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-full border border-neutral-700"
                            >
                            {name} {need}
                            </span>
                        );
                        })}
                    </div>
                    )}
                </div>
                </div>

                <button
                className="shrink-0 rounded-lg px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm"
                // wire real craft call later
                onClick={() => {
                    /* TODO: POST /api/crafting/craft with r.recipeId */
                    console.log("craft", recipeId);
                }}
                disabled={!recipeId}
                >
                Craft
                </button>
            </div>
        </div>
    );
}