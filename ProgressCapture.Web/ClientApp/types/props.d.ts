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
    goal: Goal | null;
    stats: ProgressStat[];
}

// PaginatedTable props and interfaces
export interface PaginatedTableProps<T extends object> {
    tableClass?: string;
    fields: (keyof T)[];
    values: T[];
    rowSorter: IRowSorter<T>;
    defaultSortField: keyof T | null;
    handleView: HandleViewFunc<T> | null;
    handleEdit: HandleEditFunc<T> | null;
    handleDelete: HandleDeleteFunc<T> | null;
}

export type SortOrder = 'asc' | 'desc';

export interface IRowSorter<T> {
    sortValues(values: T[], field: keyof T, order: SortOrder);
}

/**
 * User defined function for converting the values of a table cell to a string
 */
// export type TableValueConverterFunc<T> = (value: T) => string;

/**
 * Callback for viewing a row in a PaginatedTable
 */
export type HandleViewFunc<T> = (value: T) => void;

/**
 * Callback for editing a row in a PaginatedTable
 */
export type HandleEditFunc<T> = (value: T) => void;

/**
 * Callback for deleting a row in a PaginatedTable
 */
export type HandleDeleteFunc<T> = (value: T) => void;

export interface TableRowOptionsProps<T> {
    entity: T;
    rowIndex: number;
    handleView: HandleViewFunc<T> | null;
    handleEdit: HandleEditFunc<T> | null;
    handleDelete: HandleDeleteFunc<T> | null;
}

/**
 * DayOfMonth component for MonthlyCalendar
 */
export interface DayOfMonthProps {
    date: Date;
    progressEntries: ProgressEntry[];
}
