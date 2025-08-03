

export function Tile({ color }){
    return(
        <div
            className="aspect-square rounded-sm"
            style={{ backgroundColor: color }}
        />
    );
}