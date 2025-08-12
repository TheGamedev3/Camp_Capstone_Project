

"use client";



import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getRoute } from "@/utils/request";

type MenuDetails = {
    header?: string;
    menuType?: string;
    tableType?: string;
    tileId?: string;
    sendRequest?: boolean;

    recipies?:{
        totalCost: [unknown, number][];
        outputURL: string;
    };
}
export type MenuContextType = {
    menu: MenuDetails | null;
    menuRef: RefObject<MenuDetails | null>;
    setMenu: Dispatch<SetStateAction<MenuDetails | null>>;
};

const MenuContext = createContext<MenuContextType | null>(null);

export function MenuProvider({ children }){
    const[menu, setMenu] = useState<MenuDetails | null>(null);
    const currentMenu = useRef(menu);

    const menuRef = useRef(menu);

    useEffect(()=>{
        currentMenu.current = menu;
        if(menu && menu.sendRequest === true){
            const{tableType, tileId}=menu;
            getRoute({route:`POST /api/requestMenu`, body:{tableType, tileId}})
                .then(({success, result})=>{
                    if(success && currentMenu.current === menu){
                        setMenu({
                            ...currentMenu.current,
                            sendRequest: false,
                            recipies: result
                        });
                    }
                }
            );
        }
    },[menu]);
    
    return (
        <MenuContext.Provider value={{
            menu,
            menuRef,
            setMenu
        }}>
            {children}
        </MenuContext.Provider>
    );
}


export const useMenu = () => useContext(MenuContext)!;

