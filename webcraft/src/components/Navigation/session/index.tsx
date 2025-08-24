"use client";

import { Users, Globe, Backpack, BookOpen, Settings, BadgeDollarSign, ShoppingCart } from "lucide-react";
import { Tab } from "../shared/Tab";
import { SettingsTab } from "./SettingsTab";

export function SessionLinks() {
  return (
    <>
        <Tab icon={<Globe size={18}/>} span="World" href="/forest"/>
        <Tab icon={<Users size={18}/>} span="Players" href="/players"/>
        <Tab icon={<Backpack size={18}/>} span="Inventory" href="/myProfile"/>
        <Tab icon={<BadgeDollarSign size={18}/>} span="Post Trade" href="/makeTrades"/>
        <Tab icon={<ShoppingCart size={18}/>} span="All Trades" href="/trades"/>
        <Tab icon={<BookOpen size={18}/>} span="How To" href="/info"/>
        <SettingsTab/>
    </>
  );
}
