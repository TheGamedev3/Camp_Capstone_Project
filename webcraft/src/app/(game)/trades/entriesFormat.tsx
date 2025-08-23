

// show how to make a left hand side bar
// and how to make a textinput, checkbox, and dropdown inputs, change params in the url, without refreshing the page, and detecting when those params change
// or, in page start, upon visiting the page with those settings, those param settings are taken, and the setting control elements are set to those default values
"use client"

import { SearchControls } from "./controls"
import { Trades } from "./Trades"
export function EntriesLayout(){
    return(
        <div className="flex">
            {/* Left Sidebar */}
            <aside className="w-64 p-4 border-r border-gray-300">
                <SearchControls/>
            </aside>

            {/* Right Content */}
            <main className="flex-1 p-4">
                <Trades/>
            </main>
        </div>
    )
}