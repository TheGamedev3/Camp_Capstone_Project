


"use client";

import { Users, BookOpen, LogIn, Signpost } from "lucide-react";
import { Tab } from "../shared/Tab";

export function EntryLinks() {
  return (
    <>
        <Tab icon={<BookOpen size={18}/>} span="How To" href="/info"/>
        <Tab icon={<LogIn size={18}/>} span="Login" href="/login"/>
        <Tab icon={<Signpost size={18}/>} span="Signup" href="/signup"/>
        <Tab icon={<Users size={18}/>} span="Players" href="/players"/>
    </>
  );
}
