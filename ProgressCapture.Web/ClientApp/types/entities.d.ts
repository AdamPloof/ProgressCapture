/**
 * Entities used throughout the app.
 */

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
