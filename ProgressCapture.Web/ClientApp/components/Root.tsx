import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import ComponentFactory from "./ComponentFactory";

function main(): void {
    const rootContainer: HTMLElement | null = document.getElementById('pc-root-container');
    if (!rootContainer) {
        return;
    }

    const Component = ComponentFactory(rootContainer.dataset.componentType ?? '');
    const root = createRoot(rootContainer);
    root.render(
        <StrictMode>
            <Component />
        </StrictMode>
    );
}

document.addEventListener('DOMContentLoaded', main);
