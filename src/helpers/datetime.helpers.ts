import { IParsedTimeString } from '@/types/datetime';

export function isValidDate(date: string | Date): boolean {
	if (Object.prototype.toString.call(date) === '[object Date]') {
		return !isNaN((date as Date).getTime());
	} else if (typeof date === 'string') {
		return isValidDate(new Date(date));
	}
	return false;
}

export function isDate(date: string | Date): boolean {
	if (Object.prototype.toString.call(date) === '[object Date]') {
		return !isNaN((date as Date).getTime());
	}
	return false;
}

export function getDateObject(value: string | Date): Date {
	if(isDate(value)) return value as Date;
	if(!isValidDate(value)) return null;
	return new Date(value as string);
}

export function isValidTimeString(time: string) {
	if(typeof time !== 'string') return false;
	if(time.split(':').length < 2) return false;
	return isValidDate(new Date(time));
}

export function parseTimeString(time: string): IParsedTimeString {
	if(!isValidTimeString(time)) return null;
	let timeArray = time.split(':');
	let ampm = null;
	if (time.toLowerCase().indexOf('am') > -1) ampm = 'AM';
	else if (time.toLowerCase().indexOf('pm') > -1) ampm = 'PM';

	let hour = Number(timeArray[0]);
	let minute = timeArray[1].substring(0, 2);

	if (ampm === null) {
		ampm = 'AM';
		if (hour <= 0) hour = 12;
		else if (hour > 12) {
			hour = hour - 12;
			ampm = 'PM';
		}
	}

	return {
		hour: hour.toString(),
		minute,
		ampm
	};
}

export function formatDate(date: string | Date) {
	try {
		if (!date || !isValidDate(date)) return null;
		let today = new Date(date);
		let dd: string | number = today.getDate();
		let mm: string | number = today.getMonth() + 1;
		let yyyy = today.getFullYear();
		if (dd < 10) dd = '0' + dd;
		if (mm < 10) mm = '0' + mm;
		return mm + '/' + dd + '/' + yyyy;
	} catch(e) {
		console.warn('Error formatting datestring', e);
		return null;
	}
}