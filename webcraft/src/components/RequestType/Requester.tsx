

"use client"

import { useState, createContext, useContext, useRef } from 'react';
import { TextField } from './TextField';
import { ImageField } from './ImageField';

type RequesterContextType = {
  submit: () => Promise<boolean>;
  setField: (field: string, value: any) => void;
  errors: Record<string, string>;

  registerSubmitBtn: (ref: HTMLButtonElement | null) => void;
  getSubmitBtn: () => HTMLButtonElement | null;
};


export const RequesterContext = createContext<RequesterContextType | null>(null);

export function useRequesterContext() {
  const ctx = useContext(RequesterContext);
  if (!ctx) throw new Error('RequesterContext used outside of provider');
  return ctx;
}

export type RequesterType = {
    clientValidation?: () => void | Promise<void>;
    body?: () => any;
    goTo?: string,
    children: React.ReactNode,
    onSuccess?: (result:any) => void | Promise<void>;
    exitEditField: boolean;
}

import { getRoute } from '@/utils/request';
import { useEditArea } from './Editable';

export function Requester({
    clientValidation, request, body, fields, goTo, children, onSuccess,
    exitEditField=true
}: RequesterType
){
    const bodyArgs = useRef({});
    const [errors, setErrors] = useState({});

    const editCtx = useEditArea();

    //////////////
    const submitBtnRef = useRef<HTMLButtonElement | null>(null);

    const registerSubmitBtn = (ref: HTMLButtonElement | null) => {
    submitBtnRef.current = ref;
    };

    const getSubmitBtn = () => submitBtnRef.current;
    //////////////

    return(
        <RequesterContext.Provider value={
            {
                errors,
                setField(field, value){
                    bodyArgs.current[field] = value;
                },
                async submit(){
                    if(clientValidation){
                        let success2 = true;
                        let err2 = {};
                        function err(field, reason){
                            success2 = false;
                            err2[field] = reason;
                        }
                        await clientValidation({ ...bodyArgs.current, err });
                        setErrors(err2);
                        if(!success2){return}
                    }

                    // chooses to process/ what to send in the body args of the request
                    let sendBody = bodyArgs.current;
                    if(body)sendBody = body(sendBody);

                    const{success, result, err} = await getRoute({
                        route: request,
                        body: sendBody
                    });
                    setErrors(err || {});
                    if(success){
                        if(onSuccess)await onSuccess(result);

                        // NOTE: We use window.location.href instead of router.push() here to navigate
                        // because router.push() is a client-side navigation and won't trigger
                        // a full page reload — which means server-side session checks (like getSession())
                        // won't see the updated cookie immediately. This ensures the server sees
                        // the new login state on the next page load.
                        if(goTo)window.location.href = goTo;
                        else{
                            if(editCtx && exitEditField){
                                const { isEditing, select, stableId } = editCtx;
                                if(stableId && isEditing(stableId)){
                                    select(null);
                                }
                            }
                        }
                    }
                    console.log(request, success, success ? result : err, goTo)
                    return success;
                },

                getSubmitBtn, registerSubmitBtn
            }
        }>
            {children}
        </RequesterContext.Provider>
    );
}
