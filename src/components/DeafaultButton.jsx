import React from "react";
import { Button } from "@adobe/react-spectrum"

export const DefaultButton = ({variant, onPress, children}) => {
    return(
        <Button variant={variant} onPress={onPress}
            UNSAFE_style={{padding: '8px 4px'}}>
            {children} 
        </Button>
    );
}