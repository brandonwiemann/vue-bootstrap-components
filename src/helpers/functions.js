import def_get from 'lodash/get';

// Lodash get doesn't return default value if object is null
export function _get(obj, path, def) {
	if(!obj) return def;
	let result = def_get(obj, path, def);
	if(result === undefined || result === null) {
		return def;
	}
	return result;
}

/*============================================================
 == Comparison helpers
/============================================================*/

export function jsonCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export function jsonEquals(a,b) {
	return JSON.stringify(a) === JSON.stringify(b);
}

/*============================================================
 == Sorting helpers
/============================================================*/

export function dynamicSort(property) {
	let sortOrder = 1;
	if(property[0] === '-') {
		sortOrder = -1;
		property = property.substr(1);
	}
	return function (a,b) {
		let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
		return result * sortOrder;
	};
}

export function sortByQuery(val1, val2, query) {
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

/*============================================================
 == String helpers
/============================================================*/

export function slugify(url) {
	url = url.toLowerCase();
	url = url.replace(/[^a-z0-9\s-]/, '');
	url = url.replace(/\s+/, ' ');
	url = url.replace(/ /g, '-');
	return url.replace(/\-+/g, '-');
}

/*============================================================
 == Type Checkers
/============================================================*/

export function isPromise(value) {
	if (typeof value != 'object') return false;
	if (typeof value.then == 'function') return true;
}

/*============================================================
 == Debounce / Throttle
/============================================================*/

export function debounce(func, wait, immediate) {
	let timeout;
	return function() {
		let context = this, args = arguments;
		let later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

/*============================================================
 == Positioning
/============================================================*/

export function elementIsInViewport(el){
	if (typeof jQuery === 'function' && el instanceof jQuery) {
		el = el[0];
	}

	let rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

export function getPageHeightAndWidth() {
	let body = document.body;
	let html = document.documentElement;
	let height = Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	);
	let width = window.outerWidth;
	return { height, width };
}

export function elementOverflowsDocument(el) {
	if (typeof jQuery === 'function' && el instanceof jQuery) {
		el = el[0];
	}
	let max = getPageHeightAndWidth();
	return (
		el.offsetTop < 0 ||
		el.offsetTop + el.clientHeight > max.height ||
		el.offsetLeft < 0 ||
		el.offsetLeft + el.clientWidth > max.width
	);
}

// get the left and top offset of a DOM block element
// returns {x: number, y: number}
export function getPageOffset(el) {
	let rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {
		y: rect.top + scrollTop,
		x: rect.left + scrollLeft
	};
}