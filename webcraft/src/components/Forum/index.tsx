

"use client"

import { useState, createContext, useContext, useRef } from 'react';
import { TextField } from '../TextField';
import { ImageField } from '../ImageField';
import { redirect } from "next/navigation";

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
    request, bodyConstructor, fields, above, below, onSuccess }:
    {
        above?: React.ReactNode, below?: React.ReactNode,
        onSuccess?: (tools: { redirect: typeof redirect }) => void | Promise<void>;
    }
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
                    setErrors(err || {});
                    if(success && onSuccess){
                        await onSuccess({ redirect });
                    }
                }
            }
        }>
            <div className="flex flex-col gap-4">
                {above}
                {
                    fields.map(({ field, inputType, placeholder, defaultText }, i) => {
                        if (inputType === 'image') {
                        return (
                            <ImageField
                                key={i}
                                bodyField={field}
                                placeholderText={placeholder}
                                defaultText={defaultText}
                            />
                        );
                        }
                        return (
                        <TextField
                            key={i}
                            bodyField={field}
                            inputType={inputType || 'text'}
                            placeholderText={placeholder}
                            defaultText={defaultText}
                        />
                        );
                    })
                }
                {below}
            </div>
        </ForumContext.Provider>
    );
}
