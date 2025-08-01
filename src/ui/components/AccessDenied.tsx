import React from "react";
import { Button } from "@/ui/components/ui/button";
import { useView } from "@/ui/context/ViewContext";
import { getMessage } from "@/core/domain/messages";


export function AccessDenied( access: boolean) {
    const { setView } = useView();
    const [accessDenied, setAccessDenied] = React.useState(false);

    React.useEffect(() => {
        setAccessDenied(access);
    }, [access]);

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            {accessDenied ? (
                <>
                    <h2 className="text-xl font-semibold text-red-600">{getMessage("ui", "access_denied_title")}</h2>
                    <p className="mt-2 text-muted-foreground">
                        {getMessage("ui", "access_denied_message")}
                    </p>
                    <Button className="mt-4" onClick={() => setView("")}>
                        {getMessage("ui", "access_denied_button")}
                    </Button>
                </>
            ) : (
                <p>{getMessage("ui", "access_denied_loading")}</p>
            )}
        </div>
    );
}