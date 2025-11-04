import { ProgressEntry, ProgressType } from "./entities";

export interface WidgetProps {
    entityId: number | null; // The ID of the base entity for a component
}

export interface AddProgressModalProps {
    show: boolean;
    progressTypes: ProgressType[];
    handleShow: () => void;
    handleClose: () => void;
    addProgress: (progress: ProgressEntry) => void;
}
