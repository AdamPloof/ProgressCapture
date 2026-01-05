import { IRowSorter } from "types/props";
import { SortOrder } from 'types/props';

/**
 * Utility class for sorting table rows for different data types. Returns a copy
 * of the original data. It does not mutate the original array which makes this
 * safe for working with component state. 
 */
export default class TableRowSorter<T> implements IRowSorter<T> {
    sortValues(values: T[], field: keyof T, order: SortOrder): T[] {
        if (values.length === 0) {
            return [...values];
        }

        const nonEmptyRow = values.find(v => v[field] !== null);
        if (!nonEmptyRow) {
            return [...values];
        }
        
        const val = nonEmptyRow[field];
        if (val instanceof Date) {
            return this._sortByDate(values, field, order);
        }

        let sorted: T[] = [];
        switch (typeof val) {
            case 'string':
                console.log('Sorting by string');
                sorted = this._sortByString(values, field, order);
                break;
            case 'number':
                console.log('Sorting by number');
                sorted = this._sortByNumber(values, field, order);
                break;
            case 'boolean':
                console.log('Sorting by boolean');
                sorted = this._sortByBoolean(values, field, order);
                break;
            default:
                console.log('Sorting by default');
                sorted = this._sortByString(values, field, order);
        }

        return sorted;
    }

    _sortByString(values: T[], field: keyof T, order: SortOrder): T[] {
        const sorted = [...values];
        sorted.sort((a, b) => {
            const valA = String(a[field]).toLowerCase();
            const valB = String(b[field]).toLowerCase();

            if (valA === valB) {
                return 0;
            }

            const res = valA > valB ? 1 : -1;

            return order === 'asc' ? res : res * -1;
        });

        return sorted;
    }

    _sortByNumber(values: T[], field: keyof T, order: SortOrder): T[] {
        const sorted = [...values];
        sorted.sort((a, b) => {
            const valA = Number(a[field]);
            const valB = Number(b[field]);

            return order === 'asc' ? valA - valB : valB - valA;
        });

        return sorted;
    }

    _sortByBoolean(values: T[], field: keyof T, order: SortOrder): T[] {
        const sorted = [...values];
        sorted.sort((a, b) => {
            const valA = Boolean(a[field]);
            const valB = Boolean(b[field]);

            if (valA === valB) {
                return 0;
            }

            const res = valA === true ? 1 : -1;

            return order === 'asc' ? res : res * -1;
        });

        return sorted;
    }

    _sortByDate(values: T[], field: keyof T, order: SortOrder): T[] {
        const sorted = [...values];
        sorted.sort((a, b) => {
            let valA: number;
            if (a[field] instanceof Date) {
                valA = a[field].getTime();
            } else {
                valA = Number(a[field]);
            }

            let valB: number;
            if (b[field] instanceof Date) {
                valB = b[field].getTime();
            } else {
                valB = Number(b[field]);
            }

            return order === 'asc' ? valA - valB : valB - valA;
        });

        return sorted;
    }
}
