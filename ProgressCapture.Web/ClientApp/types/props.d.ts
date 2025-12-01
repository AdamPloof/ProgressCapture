import React, { JSX } from 'react';
import {
    ProgressEntry,
    ProgressEntryInputModel,
    ProgressType,
    ProgressStat
} from "./entities";

export interface WidgetProps {
    entityId: number | null; // The ID of the base entity for a component
}

export interface ProgressOptionsProps {
    entryId: number;
    handleEdit: (entityId: number) => void;
    handleDelete: (entityId: number) => void;
}

export interface ProgressModalProps {
    show: boolean;
    inputModel: ProgressEntryInputModel;
    progressTypes: ProgressType[];
    setInputModel: React.Dispatch<React.SetStateAction<ProgressEntryInputModel>>;
    handleShow: () => void;
    handleClose: () => void;
    handleSaveProgress: (progressInput: ProgressEntryInputModel) => void;
}

export interface ConfirmationModalProps {
    show: boolean;
    title: string;
    message: string | JSX.Element;
    confirmClass: string?;
    confirmBtnText: string?;
    inputModel: ProgressEntryInputModel;
    handleConfirm: (progressId: number) => Promise<void>;
    handleClose: () => void;
}

export interface AlertProps {
    title: string | null;
    message: string;
    type: string | null;
    handleClose: () => void;
}

export interface GoalSummaryProps {
    stats: ProgressStat[];
}
