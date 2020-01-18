const visaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
const mastPattern = /^(?:5[1-5][0-9]{14})$/;
const amexPattern = /^(?:3[47][0-9]{13})$/;
const discPattern = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;

export default {

	validate(validationString, value, name = null) {

		let required = validationString.toLowerCase().indexOf('required') > -1;

		// If value is blank, just validate based on whether or not one was required
		if(!value || value === '') {
			if(!required) return null;
			return 'This field is required.';
		}
		// If there are no rules, value is valid
		let rules = this._getRules(validationString);
		if(!rules || !rules.length) return null;

		let self = this;

		for (let i = 0; i < rules.length; i++) {
            let limit, { rule, param } = rules[i];
			switch (rule) {
				case 'email':
					if (!self.validateEmail(value) && value !== '') {
						return 'Please enter a valid email address';
					}
					break;
				case 'creditcart':
				case 'cc':
					if (!self.validateCC(value)) {
						return 'Please enter a valid credit card number';
					}
					break;
				case 'exp':
					if (!self.validateCCExpiration(value)) {
						return 'Please enter a valid expiration MMYY';
					}
					break;
				case 'phone':
					if (!self.validatePhone(value) && value !== '') {
						return 'Please enter a valid US phone number';
					}
					break;
				case 'min':
                case 'minlength':
                    limit = Number(param);
                    if(isNaN(limit)) return;
					if(value.length < limit) {
						let msg = `be at least ${limit} characters`;
						return name ? name + ' must ' + msg : 'Must' + msg;
					}
					break;
				case 'max':
                case 'maxlength':
                    limit = Number(param);
                    if(isNaN(limit)) return;
					if(value.length > limit) {
						let msg = `exceed ${(limit)} characters`;
						return name ? `${name} can not ${msg}`: `Can not ${msg}`;
					}
					break;
                case 'exactlength':
                    limit = Number(param);
                    if(isNaN(limit)) return;
					if(value.length !== limit) {
						let msg = `be ${limit} characters`;
						return name ? name + ' must ' + msg : 'Must' + msg;
					}
					break;
				case 'zip':
					if (!self.validateZip(value)) {
						return 'Please enter a valid Zip Code';
					}
					break;
				case 'url':
					if(!self.validateUrl(value)) {
						return 'Please enter a valid URL';
					}
					break;
				case 'url-key':
					if (!self.validateUrlKey(value)) {
						return 'Please enter a valid URL';
					}
					break;
				case 'regex':
					let regex = new RegExp(param);
					if(!regex.test(value)) {
						return 'Invalid format'
                    }
                    break;
                case 'colorhex':
                    let re = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                    if(!re.test(value)) {
                        return 'Invalid hex color';
                    }
					break;
				case 'time':
					if(!self.validateTime(value)) {
						return 'Invalid time';
					}
					break;
				case 'numeric':
                case 'number':
                    if(!self.validateNumber(value)) {
                        return 'Please enter a valid number'
					}
					break;
			}
		}
		return null;
	},

    /*============================================================
    == Helpers
    /============================================================*/

    validateCC(num) {
        num = num.replace(/[^0-9.]/g, '');
        return visaPattern.test(num) === true
    		|| mastPattern.test(num) === true
    		|| amexPattern.test(num) === true
			|| discPattern.test(num) === true;
	},

	validateCCExpiration(exp) {
		return /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(exp);
	},

    validateEmail(email) {
        if (!email) return false;
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
	},

	validateNumber(num) {
		return !isNaN(Number(num));
	},

    validatePhone(phone) {
        if (!phone) return true;
        phone = phone.replace(/\s+/g, '');
        return phone.length > 9 && /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/.test(phone);
    },

    validateZip(zip) {
        return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zip);
	},

	validateUrl(url) {
		return /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url);
	},

	validateUrlKey(url) {
		return /^[-a-z0-9]+$/.test(url);
	},

	validateTime(time) {
		return /^(0?[1-9]|1[012])(:[0-5]\d) ?[APap][mM]$/.test(time);
	},

	formatCreditCardValue(value) {
		let v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
		let matches = v.match(/\d{4,16}/g);
		let match = (matches && matches[0]) || '';
		let parts = [];

		for (i = 0, len = match.length; i < len; i += 4) {
			parts.push(match.substring(i, i + 4));
		}

		if (parts.length) {
			return parts.join('-');
		} else {
			return value;
		}
    },

    _getRules(validationString) {
        if(typeof validationString !== 'string') return [];
        let validations = validationString.split('|');
        let rules = [];
        for(let i=0; i<validations.length; i++) {
            let values = validations[i].toLowerCase().split(':');
            rules.push({ rule: values[0], param: values[1] || null });
        }
        return rules;
    }

}