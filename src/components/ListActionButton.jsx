import React from "react";
import { ActionButton, Text } from "@adobe/react-spectrum";

export default function ListActionButton({ onClick, children, ...props }) {
    return (
        <ActionButton
        onPress={onClick}
        marginTop={"size-300"}
        marginBottom={"size-200"}
        isSelected={false}
        {...props}
        width={"120%"}
        >
        {children}
        
        </ActionButton>
    );
    }