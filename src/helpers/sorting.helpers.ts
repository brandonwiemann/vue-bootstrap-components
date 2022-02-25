import { AnyObject } from '@/types/generic';

type SortFunction = (a: AnyObject, b: AnyObject) => void;

export function dynamicSort(property: string): SortFunction {
    let sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a: AnyObject, b: AnyObject) {
        const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}

export function sortByQuery(val1: string, val2: string, query: string): number {
    if (!val1 || !val2 || !query) return 0;
    query = query.toLowerCase();
    val1 = val1.toLowerCase();
    val2 = val2.toLowerCase();
    const indexA = val1.indexOf(query);
    const indexB = val2.indexOf(query);
    if (indexA === indexB) {
        if (val1 < val2) {
            return -1;
        }
        if (val1 > val2) {
            return 1;
        }
        return 0;
    }
    return indexA - indexB;
}