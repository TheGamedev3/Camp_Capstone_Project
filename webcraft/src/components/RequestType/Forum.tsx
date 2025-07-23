

"use client"

import { useState, createContext, useContext, useRef } from 'react';
import { TextField } from './TextField';
import { ImageField } from './ImageField';
import { Requester } from './Requester';

import { getRoute } from '@/utils/request';

export function Forum({
    request, bodyConstructor, fields, goTo, above, below, onSuccess }:
    {
        goTo?: string,
        above?: React.ReactNode, below?: React.ReactNode,
        onSuccess?: () => void | Promise<void>;
    }
){
    return(
        <Requester
            request={request}
            bodyConstructor={bodyConstructor}
            fields={fields}
            onSuccess={onSuccess}
            goTo={goTo}
        >
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
        </Requester>
    );
}
