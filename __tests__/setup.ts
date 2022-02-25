/* eslint-disable no-console */
import { format } from 'util';

/**
 * Override console.error to throw an error and cause tests to fail
 * // TODO: Only run this on for vue component tests
 * https://github.com/facebook/jest/issues/6121#issuecomment-529591574
 */
const error = console.error;
console.error = function(...args) {
	error(...args);
	throw new Error(format(...args));
};