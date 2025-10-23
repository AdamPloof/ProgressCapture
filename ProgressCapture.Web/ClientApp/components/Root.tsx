import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import GoalManager from "./Goals/GoalManager";
import { WidgetProps } from "../types/props";

function main(): void {
    const rootContainer: HTMLElement | null = document.getElementById('pc-root-container');
    if (!rootContainer) {
        return;
    }

    // const Component = ComponentFactory(rootContainer.dataset.componentType ?? '');
    const componentProps: WidgetProps = {entityId: Number(rootContainer.dataset.entityId) ?? null}
    const root = createRoot(rootContainer);
    root.render(
        <StrictMode>
            <GoalManager {...componentProps} />
        </StrictMode>
    );
}

document.addEventListener('DOMContentLoaded', main);
