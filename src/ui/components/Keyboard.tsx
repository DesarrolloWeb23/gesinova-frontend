'use client';
import React, { useState } from 'react';

const keys = [
    ['1','2','3','4','5','6','7','8','9','0','-','='],
    ['q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['a','s','d','f','g','h','j','k','l',';','\''],
    ['z','x','c','v','b','n','m',',','.','/']
];

export const Keyboard = () => {
    const [output, setOutput] = useState('');

    const handleClick = (key: string) => {
        setOutput(prev => prev + (key === 'space' ? ' ' : key));
    };

    return (
        <div className="w-full flex flex-col items-center text-white">
        <div className="w-[740px] bg-gray-800 rounded shadow p-4 mb-4 text-center text-2xl">{output || <span className="opacity-30">type...</span>}</div>
        {keys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex w-[740px] flex-wrap gap-1 justify-center mb-1">
            {row.map((key, keyIndex) => (
                <button
                key={keyIndex}
                className="bg-white text-black rounded px-4 py-2 hover:bg-gray-300"
                onClick={() => handleClick(key)}
                >
                {key}
                </button>
            ))}
            </div>
        ))}
        <div className="flex gap-2 w-[740px] justify-between mt-2">
            <button onClick={() => setOutput(prev => prev.slice(0, -1))} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            <button onClick={() => handleClick(' ')} className="bg-blue-600 text-white px-4 py-2 rounded flex-1">Space</button>
        </div>
        </div>
    );
};
