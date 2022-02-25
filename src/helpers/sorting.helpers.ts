import { AnyObject } from '@/types/generic';

export function dynamicSort(property: string) {
	let sortOrder = 1;
	if(property[0] === '-') {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a: AnyObject, b: AnyObject) {
		let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	};
}

export function sortByQuery(val1: string, val2: string, query: string) {
	if(!val1 || !val2 || !query) return 0;
	query = query.toLowerCase();
	val1 = val1.toLowerCase();
	val2 = val2.toLowerCase();
	let indexA = val1.indexOf(query);
	let indexB = val2.indexOf(query);
	if (indexA === indexB) {
		if (val1 < val2) { return -1; }
		if (val1 > val2) { return 1; }
		return 0;
	}
	return indexA - indexB;
}