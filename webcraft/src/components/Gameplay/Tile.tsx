

export function Tile({ color }){
    return(
        <div
            className="w-20 h-20 border border-gray-400"
            style={{ backgroundColor: color }}
        />
    );
}