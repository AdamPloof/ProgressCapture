/**
 * Entities used throughout the app.
 */

export interface Goal {
    id: number;
    name: string;
    description: string;
}

export interface UnitOfMeasure {
    id: number;
    name: string;
    shortName: string;
}

export interface ProgressType {
    id: number;
    name: string;
    description: string;
    target: number;
    goalId: number;
    unitOfMeasure: UnitOfMeasure;
}

export interface ProgressEntry {
    id: number;
    date: Date;
    amount: number;
    notes: string | null;
    progressType: ProgressType;
}

export interface ProgressEntryTableRow {
    id: number;
    date: Date;
    amount: number;
    notes: string | null;
    type: string;
}

export interface ProgressEntryInputModel {
    id: number | null;
    goalId: number | null;
    date: Date | null;
    amount: number | null;
    notes: string | null;
    progressTypeId: number | null;
}

export interface ProgressStat {
    typeId: number;
    name: string;
    current: number;
    total: number;
    unitOfMeasure: string;
}
