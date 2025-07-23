

"use client"

import { useState, createContext, useContext, useRef } from 'react';
import { TextField } from './TextField';
import { ImageField } from './ImageField';

type RequesterContextType = {
  errors: Record<string, string>;
  setField: (field: string, value: any) => void;
  submit: () => Promise<void>;
};

export const RequesterContext = createContext<RequesterContextType | null>(null);

export function useRequesterContext() {
  const ctx = useContext(RequesterContext);
  if (!ctx) throw new Error('RequesterContext used outside of provider');
  return ctx;
}

import { getRoute } from '@/utils/request';

export function Requester({
    request, bodyConstructor, fields, goTo, children, onSuccess }:
    {
        goTo?: string,
        children: React.ReactNode,
        onSuccess?: () => void | Promise<void>;
    }
){
    const bodyArgs = useRef({});
    const [errors, setErrors] = useState({});

    return(
        <RequesterContext.Provider value={
            {
                errors,
                setField(field, value){
                    bodyArgs.current[field] = value;
                },
                async submit(){
                    const{success, result, err} = await getRoute({
                        route: request,
                        body: bodyArgs.current
                    });
                    setErrors(err || {});
                    if(success){
                        if(onSuccess)await onSuccess();

                        // NOTE: We use window.location.href instead of router.push() here to navigate
                        // because router.push() is a client-side navigation and won't trigger
                        // a full page reload — which means server-side session checks (like getSession())
                        // won't see the updated cookie immediately. This ensures the server sees
                        // the new login state on the next page load.
                        if(goTo)window.location.href = goTo;

                    }
                    console.log(request, success, result, goTo)
                    return success;
                }
            }
        }>
            {children}
        </RequesterContext.Provider>
    );
}
