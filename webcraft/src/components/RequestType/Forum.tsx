

"use client"

import { useRef, useEffect } from 'react';
import { TextField } from './TextField';
import { ImageField } from './ImageField';
import { ItemsField, BuyItemsField } from './ItemsField';
import { Requester } from './Requester';

import { RequesterType } from './Requester';

type FormFields = {
  fields: {field: string, inputType?: string, placeholder?: string, defaultText?: string}[]
  above?: React.ReactNode;
  below?: React.ReactNode;
  clearOnSuccess?: boolean;
  debounceCheck?: number;
  onSuccess?: (result:T) => void | Promise<void>;
}

type ForumType = RequesterType & FormFields;

export function Forum<T = unknown>({
    above, fields, below,
    clearOnSuccess=false,
    debounceCheck,
    onSuccess,
    ...rest
}:ForumType){
    const uponSuccess = useRef<((result: T)=>void)[]>([]);
    return(
        <Requester<T>
          onSuccess={async(result: T)=>{
            if(onSuccess)await onSuccess(result);
            uponSuccess.current.forEach((func,i)=>func(result));
          }}
          debounceCheck={debounceCheck}
          {...rest}
        >
            <InnerForum
                fields={fields}
                above={above}
                below={below}
                debounceCheck={debounceCheck}
                clearOnSuccess={clearOnSuccess}
                uponSuccess={(func:()=>void)=>{
                  uponSuccess.current.push(func);
                  return()=>{
                    const i = uponSuccess.current.indexOf(func);
                    uponSuccess.current.splice(i, 1);
                  }
                }}
            />
        </Requester>
    );
}

import { useRequesterContext } from './Requester';

// move reset on default up here!
function InnerForum({fields, above, below, clearOnSuccess, debounceCheck, uponSuccess}:FormFields&{uponSuccess:(func:()=>void)=>void}){
  const { setDefault, errors, getSubmitBtn } = useRequesterContext();
  const refs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    function setToDefault(){
      fields.forEach(({ field, defaultText }) => {
        if (field && defaultText!==undefined) setDefault(field, defaultText);
      });
    }

    setToDefault();
    if(clearOnSuccess){
      return uponSuccess(setToDefault);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Move to next or submit
      if (index < refs.current.length-1) {
        refs.current[index + 1]?.focus();
      } else {
        // Trigger form submit programmatically
        getSubmitBtn()?.click();
      }
    }
  };

  useEffect(() => {
    if(debounceCheck)return;

    // Focus earliest error
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const idx = fields.findIndex(f => f.field === firstErrorField);
      if (idx !== -1) refs.current[idx]?.focus();
    }
  }, [debounceCheck, errors]);

  return (
    <div className="flex flex-col gap-4">
      {above}
      {fields.map(({ label, field, inputType, placeholder, defaultText, ...rest }, i) => {
        const commonProps = {
          label,
          bodyField: field,
          defaultText,
          placeholderText: placeholder,
          inputType: inputType || "text",
          inputRef: (el: HTMLInputElement) => (refs.current[i] = el),
          onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, i),
        };
        switch(inputType){
          case"image": return <ImageField key={i} {...commonProps} {...rest} />;
          case"items": return <ItemsField key={i} {...commonProps} {...rest} />;
          case"buyItems": return <BuyItemsField key={i} {...commonProps} {...rest} />;
          default: return <TextField key={i} {...commonProps} {...rest} />;
        }
      })}
      {below}
    </div>
  );
}

export function SetTextInput(forum:string, input:string, setter:(pre:string)=>string){
  const el = document.querySelector(`[data-forum="${forum}"] input[name="${input}"]`);
  const prev = el.value;

  if(prev === input)return;
  Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set.call(el, setter(prev));
  // let React know & mark this as our own change
  el.dispatchEvent(new InputEvent('input', { bubbles: true, data: "__CLIENT_SET__" }));
}
