import React, { useRef, useState, useEffect } from "react";

type CodeInputProps = {
    value: string;
    onChange: (value: string) => void;
    hasError?: boolean;
    resetTrigger?: number;
};

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChange, hasError = false, resetTrigger,  }) => {
    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const inputsRef = useRef<Array<HTMLInputElement | null>>([]);


    // Sincronizar valor externo
    useEffect(() => {
        const newCode = value.split("").concat(Array(6 - value.length).fill(""));
        setCode(newCode);
    }, [value]);

    // Limpiar inputs al recibir nuevo trigger
    useEffect(() => {
        setCode(Array(6).fill(""));
        onChange("");
        
        inputsRef.current.forEach((input) => {
            if (input) {
                input.classList.remove("fade");
                void input.offsetWidth;
                input.classList.add("fade");
            }
        });

        inputsRef.current[0]?.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetTrigger]);


    const handleInput = (val: string, index: number) => {
        if (!/^\d?$/.test(val)) return;

        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);
        onChange(newCode.join(""));
        if (val && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && code[index] === "" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(paste)) {
        e.preventDefault();
        const newCode = paste.split("");
        setCode(newCode);
        newCode.forEach((digit, i) => animateInput(i));
        inputsRef.current[5]?.focus();
        }
    };

    const animateInput = (index: number) => {
        const input = inputsRef.current[index];
        if (input) {
        input.classList.remove("flip", "bounce");
        void input.offsetWidth; // trigger reflow
        input.classList.add("flip");
        }
    };


    return (
        <div className={`code-inputs ${hasError ? "shake" : "border-gray-300"}`} id="inputsWrapper">
                {code.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                            inputsRef.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInput(e.target.value, i)}
                        onKeyDown={(e) => handleBackspace(e, i)}
                        onPaste={handlePaste}
                        className={`w-10 h-10 text-center border rounded ${hasError ? "error-border" : "border-gray-300"}`}
                    />
                ))}
        </div>
    );
};
