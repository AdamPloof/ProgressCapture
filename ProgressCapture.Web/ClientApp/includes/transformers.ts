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
            id: d.progressType.unitOfMeasure.id,
            name: d.progressType.unitOfMeasure.name,
            shortName: d.progressType.unitOfMeasure.shortName
        };
        const type: ProgressType = {
            id: d.progressType.id,
            name: d.progressType.name,
            description: d.progressType.description,
            target: d.progressType.target,
            goalId: d.progressType.goalId,
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

export function progressTypeTransformer(data: any): ProgressType[] {
    const types: ProgressType[] = [];
    for (const d of data) {
        const uom: UnitOfMeasure = {
            id: d.unitOfMeasure.id,
            name: d.unitOfMeasure.name,
            shortName: d.unitOfMeasure.shortName,
        };

        const type: ProgressType = {
            id: d.id,
            name: d.name,
            description: d.description,
            goalId: d.goalId,
            unitOfMeasure: uom,
            target: d.target
        };

        types.push(type);
    }

    return types;
}
