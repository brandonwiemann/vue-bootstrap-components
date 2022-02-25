export function jsonCopy<T>(obj: T): T  {
    return JSON.parse(JSON.stringify(obj));
}

export function jsonEquals(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}