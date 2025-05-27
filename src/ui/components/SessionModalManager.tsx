let resolveFn: (value: boolean) => void;

export const showSessionModal = (): Promise<boolean> => {
    const modalEvent = new CustomEvent("show-session-modal");
    window.dispatchEvent(modalEvent);
    return new Promise((resolve) => {
        resolveFn = resolve;
    });
};

export const resolveModal = (value: boolean) => {
    resolveFn?.(value);   
};