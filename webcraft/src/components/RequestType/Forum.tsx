

"use client"

import { useState, createContext, useContext, useRef, useEffect, useCallback } from 'react';
import { TextField } from './TextField';
import { ImageField } from './ImageField';
import { Requester } from './Requester';

import { getRoute } from '@/utils/request';

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
    const uponSuccess = useRef<(()=>void)[]>([]);
    return(
        <Requester<T>
          onSuccess={async(result: T)=>{
            if(onSuccess)await onSuccess(result);
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
        if (field && defaultText) setDefault(field, defaultText);
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
      {fields.map(({ label, field, inputType, placeholder, defaultText }, i) => {
        const commonProps = {
          label,
          bodyField: field,
          defaultText,
          placeholderText: placeholder,
          inputType: inputType || "text",
          inputRef: (el: HTMLInputElement) => (refs.current[i] = el),
          onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, i),
        };
        return inputType === "image" ? (
            <ImageField key={i} {...commonProps} />
        ) : (
            <TextField key={i} {...commonProps} />
        );
      })}
      {below}
    </div>
  );
}
