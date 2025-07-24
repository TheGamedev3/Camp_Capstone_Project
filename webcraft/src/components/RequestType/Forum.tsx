

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
    const { setField } = useRequesterContext();
    useEffect(()=>{
        fields.forEach(({field, defaultText})=>{
            if(field && defaultText)setField(field, defaultText);
        });
    },[]);
    return(
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
    );
}