export function jsonCopy(obj: any) {
	return JSON.parse(JSON.stringify(obj));
}

export function jsonEquals(a: any, b: any) {
	return JSON.stringify(a) === JSON.stringify(b);
}