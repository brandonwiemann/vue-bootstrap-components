export function validateColorHex(colorHex: string): boolean {
    const re = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return re.test(colorHex);
}

export function validateEmail(email: string): boolean {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function validateNumber(num: string): boolean {
    return !isNaN(Number(num));
}

export function validatePhone(phone: string): boolean {
    if (!phone) return true;
    phone = phone.replace(/\s+/g, '');
    return phone.length > 9 && /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/.test(phone);
}

export function validateZip(zip: string): boolean {
    return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
}

export function validateUrl(url: string): boolean {
    return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url);
}

export function validateUrlKey(url: string): boolean {
    return /^[-a-z0-9]+$/.test(url);
}

export function validateTime(time: string): boolean {
    return /^(0?[1-9]|1[012])(:[0-5]\d) ?[APap][mM]$/.test(time);
}

export function validateCC(num: string): boolean {
    const visaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    const mastPattern = /^(?:5[1-5][0-9]{14})$/;
    const amexPattern = /^(?:3[47][0-9]{13})$/;
    const discPattern = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    num = num.replace(/[^0-9.]/g, '');
    return visaPattern.test(num) === true
		|| mastPattern.test(num) === true
		|| amexPattern.test(num) === true
		|| discPattern.test(num) === true;
}

export function validateCCExpiration(exp: string): boolean {
    return /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(exp);
}