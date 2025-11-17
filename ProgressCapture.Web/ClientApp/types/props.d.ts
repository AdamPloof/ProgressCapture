import React, { JSX } from 'react';
import {
    ProgressEntry,
    ProgressEntryInputModel,
    ProgressType
} from "./entities";

export interface WidgetProps {
    entityId: number | null; // The ID of the base entity for a component
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

export interface ProgressOptionsProps {
    entryId: number;
    handleEdit: (entityId: number) => void;
    handleDelete: (entityId: number) => void;
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
