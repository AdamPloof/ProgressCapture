import React, { JSX, StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import ProgressTable from "./ProgressTable/ProgressTable";
import ProgressCalendar from "./ProgressCalendar/ProgressCalendar";
import { WidgetProps } from "../types/props";

function componentFactory(componentType: string, props: WidgetProps): JSX.Element {
    let component: JSX.Element;
    switch (componentType) {
        case 'ProgressTable':
            component = <ProgressTable {...props}></ProgressTable>;
            break;
        case 'ProgressCalendar':
            component = <ProgressCalendar {...props}></ProgressCalendar>;
            break;
        default:
            throw new Error(`Unknown component type: ${componentType}`);
    }

    return component;
}

function main(): void {
    const rootContainer: HTMLElement | null = document.getElementById('pc-root-container');
    if (!rootContainer) {
        return;
    }

    const componentProps: WidgetProps = {entityId: Number(rootContainer.dataset.entityId) ?? null}
    const componentType: string = rootContainer.dataset.componentType ?? '';
    const root = createRoot(rootContainer);
    root.render(
        <StrictMode>
            {componentFactory(componentType, componentProps)}
        </StrictMode>
    );
}

document.addEventListener('DOMContentLoaded', main);
