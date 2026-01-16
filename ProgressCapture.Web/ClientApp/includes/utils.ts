import { Transformer } from "./transformers";
import {
    ProgressStat,
    ProgressEntry,
    ProgressType
} from "types/entities";

/**
 * Simple wrapper around fetch() for retreiving json data
 *  
 * @param {string} url 
 * @returns {Promise<T>}
 */
export async function fetchData<T>(url: string, transformer: Transformer<T>): Promise<T> {
    const params = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    };
    const res = await fetch(url, params);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}, url: ${url}`);
    }

    return transformer(await res.json());
};

/**
 * @param {number} max the highest integer allowed for the random number
 */
export function randInt(max: number): number {
    return Math.floor(Math.random() * max);
}

/**
 * Return a random element from an array
 * 
 * @param {array} arr 
 * @return {str|int|float|null}
 */
export function randChoice<T>(arr: Array<T>): T {
    return arr[randInt(arr.length)];
}

/**
 * Generates a psuedo-random unique key. Useful for generating keys for
 * lists of elements
 * 
 * @returns {string}
 */
export function uniqueKey(): string {
    return "id" + Math.random().toString(16).slice(2);
}

/**
 * Replace placeholders in a URL
 * 
 * Example: 
 * url = 'my-path/{id}/root/{name}'
 * replacements = [42, 'foo']
 * 
 * returns 'my-path/42/root/foo'
 * 
 * @param {string} url 
 * @param {string[]} replacements 
 * @returns 
 */
export function replaceUrlPlaceholders(url: string, replacements: string[]): string {
    let replacementIdx = 0;

    return url.replace(/{[^}]+}/g, () => {
        const repl = replacements[replacementIdx++];

        return repl !== undefined ? String(repl) : '';
    });
}

/**
 * Format a Date as a string in yyyy-mm-dd format
 * 
 * @param {Date} date
 * @returns {string}
 */
export function formatDateYmd(date: Date): string {
    const dateStr = date.toISOString().split('T')[0];

    return dateStr;
}

/**
 * Get the short name for the day of a week for a date
 * 
 * @param date 
 * @returns 
 */
export function getDayOfWeekName(date: Date): string {
    const WEEKDAYS = [
        'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
    ];

    return WEEKDAYS[date.getDay()];
}

export function longMonthName(date: Date): string {
    const MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    return MONTHS[date.getMonth()];
}

/**
 * Returns a copy of a string converted to sentence case
 * 
 * Example
 * input: this is my sentence
 * output: This is my sentence
 * 
 * 
 * @param {string} str
 * @returns {string}
 */
export function sentenceCase(str: string): string {
    if (str.length === 0) {
        return str;
    }

    let formatted = str.toLowerCase();

    return formatted.charAt(0).toUpperCase() + formatted.substring(1);
}

/**
 * Returns a copy of a string converted to title case
 * 
 * Example
 * input: this is my title
 * output: This Is My Title
 * 
 * 
 * @param {string} str
 * @returns {string}
 */
export function titleCase(str: string): string {
    if (str.length === 0) {
        return str;
    }

    const ALL_CAPS_WORDS = ['id'];

    const capitalizeWord = (word: string): string => {
        if (ALL_CAPS_WORDS.includes(word)) {
            return word.toUpperCase();
        }

        return word.charAt(0).toUpperCase() + word.substring(1);
    }

    const words = str
        .toLowerCase()
        .split(' ')
        .map(capitalizeWord);

    return words.join(' ');
}

export function calculateProgressStats(
    types: ProgressType[],
    entries: ProgressEntry[]
): ProgressStat[] {
    if (types.length === 0) {
        return [];
    }

    const stats: Map<number, ProgressStat> = new Map();
    for (const t of types) {
        stats.set(t.id, {
            typeId: t.id,
            name: t.name,
            current: 0.0,
            total: t.target,
            unitOfMeasure: t.unitOfMeasure.name
        });
    }

    for (const e of entries) {
        const stat = stats.get(e.progressType.id);
        if (!stat) {
            let errMsg = `Unkown progress type for entry: ${e.id}. `;
            errMsg += 'Could not find a progress type for the current goal.';
            throw new Error(errMsg);
        }

        stat.current += e.amount;
    }

    return Array.from(stats.values());
}

export function roundTo(num: number, places: number = 2) {
    if (!Number.isInteger(places)) {
        return num;
    }

    return Math.round(num * (10 ** places)) / (10 ** places);
}
