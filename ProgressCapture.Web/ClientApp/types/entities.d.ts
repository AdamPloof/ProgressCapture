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

export interface ProgressEntryInputModel {
    goalId: number;
    date: Date;
    amount: number;
    notes: string | null;
    progressTypeId: number;
}
