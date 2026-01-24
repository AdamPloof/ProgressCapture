import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { ControlType } from "types/props";
import { CONTROL_TYPES } from "../includes/consts";
import ProgressManager from "./ProgressManager";

function main(): void {
    const rootContainer: HTMLElement | null = document.getElementById('pc-root-container');
    if (!rootContainer) {
        return;
    }

    if (!rootContainer.dataset.entityId) {
        throw new Error(`Root container must define an entity ID. Got ${rootContainer.dataset.entityId}`);
    }

    const dataControlType: string = rootContainer.dataset.controlType ?? '';
    if (
        dataControlType !== CONTROL_TYPES.CALENDAR_MONTH
        && dataControlType !== CONTROL_TYPES.CALENDAR_WEEK
        && dataControlType !== CONTROL_TYPES.LIST
    ) {
        const validTypes: string = Object.values(CONTROL_TYPES).join(', ');
        throw new Error(`Control type must be a one of ${validTypes}. Got: ${dataControlType}`);
    }

    const goalId = Number(rootContainer.dataset.entityId);
    const controlType: ControlType = dataControlType;
    const root = createRoot(rootContainer);
    root.render(
        <StrictMode>
            <ProgressManager goalId={goalId} controlType={controlType}></ProgressManager>
        </StrictMode>
    );
}

document.addEventListener('DOMContentLoaded', main);
