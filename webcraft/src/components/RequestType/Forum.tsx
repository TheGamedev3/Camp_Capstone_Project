

"use client"

import { useState, createContext, useContext, useRef, useEffect } from 'react';
import { TextField } from './TextField';
import { ImageField } from './ImageField';
import { Requester } from './Requester';

import { getRoute } from '@/utils/request';

import { RequesterType } from './Requester';

type FormFields = {
  fields: {field: string, inputType?: string, placeholder?: string, defaultText?: string}[]
  above?: React.ReactNode;
  below?: React.ReactNode;
}

type ForumType = RequesterType & FormFields;

export function Forum({
    above, fields, below,
    ...rest
}:ForumType){
    return(
        <Requester {...rest}>
            <InnerForum
                fields={fields}
                above={above}
                below={below}
            />
        </Requester>
    );
}

import { useRequesterContext } from './Requester';

function InnerForum({fields, above, below}:FormFields){
  const { setField, errors, submit, getSubmitBtn } = useRequesterContext();
  const refs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    fields.forEach(({ field, defaultText }) => {
      if (field && defaultText) setField(field, defaultText);
    });
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      console.log(index, refs.current.length)
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
    // Focus earliest error
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const idx = fields.findIndex(f => f.field === firstErrorField);
      if (idx !== -1) refs.current[idx]?.focus();
    }
  }, [errors]);

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
