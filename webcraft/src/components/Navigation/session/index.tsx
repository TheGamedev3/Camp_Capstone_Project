"use client";

import { Users, Globe, Backpack, BookOpen, Settings } from "lucide-react";
import { Tab } from "../shared/Tab";
import { SettingsTab } from "./SettingsTab";

export function SessionLinks() {
  return (
    <>
        <Tab icon={<Users size={18}/>} span="Players" href="/players"/>
        <Tab icon={<Globe size={18}/>} span="World" href="/world"/>
        <Tab icon={<Backpack size={18}/>} span="Inventory" href="/myProfile"/>
        <Tab icon={<BookOpen size={18}/>} span="How To" href="/howto"/>
        <SettingsTab/>
    </>
  );
}
