

"use client"

import { useState, createContext, useContext, useRef } from 'react';

type ForumContextType = {
  errors: Record<string, string>;
  setField: (field: string, value: any) => void;
  submit: () => Promise<void>;
};

export const ForumContext = createContext<ForumContextType | null>(null);

export function useForumContext() {
  const ctx = useContext(ForumContext);
  if (!ctx) throw new Error('ForumContext used outside of provider');
  return ctx;
}

import { getRoute } from '@/utils/request';

export function Forum({
    request, bodyConstructor, children, onSuccess }: { children: React.ReactNode }
){
    const [errors, setErrors] = useState({});

    const bodyArgs = useRef({});
    return(
        <ForumContext.Provider value={
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
                    console.log('SUBMITTING....', success, result, err)
                    if(success){
                        onSuccess?.();
                    }else{
                        setErrors(err);
                    }
                }
            }
        }>
            {children}
        </ForumContext.Provider>
    );
}
