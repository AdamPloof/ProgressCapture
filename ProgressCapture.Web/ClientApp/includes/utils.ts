import { Transformer } from "./transformers";

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

    return url.replace(/{[^]+}/g, () => {
        const repl = replacements[replacementIdx++];

        return repl !== undefined ? String(repl) : '';
    });
}
