import React, { JSX } from 'react';
import {
    ProgressEntry,
    ProgressEntryInputModel,
    ProgressType,
    ProgressStat
} from "./entities";

export type ControlType = 'calendar-month' | 'calendar-week' | 'list';

export interface NavbarProps {
    goals: Goal[];
    activeControl: ControlType;
    handleChangeGoal(goal: Goal): void;
    handleChangeControlType(controlType: ControlType): void;
}

export interface ProgressModalProps {
    show: boolean;
    handleShow(): void;
    handleClose(): void;
    content: JSX.Element | null;
}

export interface ViewProgressModalProps {
    show: boolean;
    entry: ProgressEntry;
    handleEdit: HandleEditFunc;
    handleDelete: HandleDeleteFunc;
    handleShow: () => void;
    handleClose: () => void;
}

export interface EditProgressModalProps {
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

/**
 * ## Progress Controls ##
 * These types are used to provide a generic interface to allow for different
 * ways of displaying an editing ProgressEntries. For example, the calendar view or
 * the table view
 */

/**
 * ProgressManager provides the core functionality of the view for progress
 * entries. It takes in the ProgressControl as a prop.
 */
export interface ProgressManagerProps {
    goalId: number;
    controlType: ComponentType;
}

/**
 * Any entity with an `id` property is Identifiable
 */
export interface Identifiable {
    id: number;
}

/**
 * ProgressControl is the main content control/widget for displaying
 * progress entries.
 */
export interface ProgressControlProps {
    goal: Goal | null;
    entries: ProgressEntry[];
    goalLoading: boolean;
    progressLoading: boolean;
    handleView: HandleViewFunc;
    handleCreate: HandleCreateFunc;
    handleEdit: HandleEditFunc;
    handleDelete: HandleDeleteFunc;
}

/**
 * A ProgressControl is a functional component responsible for rendering a set
 * of Progress Entries.
 */
export type ProgressControl = (props: ProgressControlProps) => JSX.Element;

/**
 * Callback for creating a new entity from ProgressControl
 */
export type HandleCreateFunc = (defaultDate: Date | null = null) => void;

/**
 * Callback for viewing an entity from a ProgressControl
 */
export type HandleViewFunc = (entityId: number) => void;

/**
 * Callback for editing an entity from a ProgressControl
 */
export type HandleEditFunc = (entityId: number) => void;

/**
 * Callback for deleting an entity from a ProgressControl
 */
export type HandleDeleteFunc = (entityId: number) => void;

// PaginatedTable props and interfaces
export interface PaginatedTableProps<T extends Identifiable> {
    tableClass?: string;
    fields: (keyof T)[];
    values: T[];
    rowSorter: IRowSorter<T>;
    defaultSortField: keyof T | null;
    handleView: HandleViewFunc<T>;
    handleEdit: HandleEditFunc<T>;
    handleDelete: HandleDeleteFunc<T>;
}

export type SortOrder = 'asc' | 'desc';

export interface IRowSorter<T> {
    sortValues(values: T[], field: keyof T, order: SortOrder);
}

/**
 * User defined function for converting the values of a table cell to a string
 */
// export type TableValueConverterFunc<T> = (value: T) => string;

export interface TableRowOptionsProps<T> {
    entity: T;
    rowIndex: number;
    handleView: HandleViewFunc;
    handleEdit: HandleEditFunc;
    handleDelete: HandleDeleteFunc;
}

/**
 * DayOfMonth component for MonthlyCalendar
 */
export interface CalendarDayProps {
    date: Date;
    progressEntries: ProgressEntry[];
    progressTypeColorMap: Map<number, number>;
    inCurrentMonth: boolean;
    handleCreate: HandleCreateFunc;
    handleView: HandleViewFunc;
    handleEdit: HandleEditFunc;
    handleDelete: HandleDeleteFunc;
}
