import { AnyObject } from '@/types/generic';

export function hasOwnProperty(obj: AnyObject, property: string): boolean {
	return Object.hasOwnProperty.call(obj, property);
}