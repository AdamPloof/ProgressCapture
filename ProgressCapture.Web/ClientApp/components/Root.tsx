import React, { JSX, StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import ProgressManager from "./ProgressManager";
import ProgressTable from "./ProgressTable/ProgressTable";
import ProgressCalendar from "./ProgressCalendar/ProgressCalendar";
import { ProgressControl } from "types/props";

function componentFactory(componentType: string, goalId: number): JSX.Element {
    let control: ProgressControl;
    switch (componentType) {
        case 'ProgressTable':
            control = ProgressTable;
            break;
        case 'ProgressCalendar':
            control = ProgressCalendar
            break;
        default:
            throw new Error(`Unknown component type: ${componentType}`);
    }

    return <ProgressManager goalId={goalId} control={control}></ProgressManager>;
}

function main(): void {
    const rootContainer: HTMLElement | null = document.getElementById('pc-root-container');
    if (!rootContainer) {
        return;
    }

    if (!rootContainer.dataset.entityId) {
        throw new Error(`Root container must define an entity ID. Got ${rootContainer.dataset.entityId}`);
    }

    const goalId = Number(rootContainer.dataset.entityId);
    const componentType: string = rootContainer.dataset.componentType ?? '';
    const root = createRoot(rootContainer);
    root.render(
        <StrictMode>
            {componentFactory(componentType, goalId)}
        </StrictMode>
    );
}

document.addEventListener('DOMContentLoaded', main);
