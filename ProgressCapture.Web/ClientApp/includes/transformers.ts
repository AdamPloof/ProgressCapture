/**
 * A collection of functions that convert JSON data into specific types.
 */

import {
    Goal,
    ProgressEntry,
    ProgressType,
    UnitOfMeasure
} from "types/entities";

export type Transformer<T> = (data: any) => T;

// TODO: Need to handle situations where the data can't be transformed into T
// such as when there is no entity for an ID
export function goalTransformer(data: any): Goal {
    const goal: Goal = {
        id: Number(data.id),
        name: String(data.name),
        description: String(data.description)
    };

    return goal;
}

export function progressEntriesTransformer(data: any): ProgressEntry[] {
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
