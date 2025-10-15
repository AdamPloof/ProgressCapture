/**
 * A collection of functions that convert JSON data into specific types.
 */

import {
    ProgressEntry,
    ProgressType,
    UnitOfMeasure
} from "types/entities";

export type Transformer<T> = (data: any[]) => T;

export function ProgressEntriesTransformer(data: any[]): ProgressEntry[] {
    const entries: ProgressEntry[] = [];
    for (const d of data) {
        const uom: UnitOfMeasure = {
            id: d.uom.id,
            name: d.uom.name,
            shortName: d.uom.shortName
        };
        const type: ProgressType = {
            id: d.type.id,
            name: d.type.name,
            description: d.type.description,
            target: d.type.target,
            goalId: d.type.goalId,
            unitOfMeasure: uom,
        };
        const entry: ProgressEntry = {
            id: d.id,
            date: new Date(d.date),
            amount: d.amount,
            notes: d.notes ?? null,
            progressType: type
        };

        entries.push(entry);
    }

    return entries;
}

