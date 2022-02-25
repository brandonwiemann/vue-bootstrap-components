import {
	validateEmail,
	validateCC,
	validateCCExpiration,
	validatePhone,
	validateZip,
	validateUrl,
	validateUrlKey,
	validateColorHex,
	validateTime,
	validateNumber
} from '@/helpers/validation.helpers.ts';
import { ValidatorFunction, IValidateRequest } from '@/types/forms';

export const VALIDATORS: Record<string, ValidatorFunction> = {

	'between': (req: IValidateRequest) => {
		let range = req.param.split(','),
			low = Number(range[0]),
			high = Number(range[1]),
			val = Number(req.value);
		if(val >= low && val <= high) return null;
		return `Must be between ${low} and ${high}`;
	},

	'cc': (req: IValidateRequest) => {
		if(validateCC(req.value)) return null;
		return 'Please enter a valid credit card number';
	},

	'colorhex': (req: IValidateRequest) => {
		if(validateColorHex(req.value)) return null;
		return 'Invalid hex color';
	},

	'email': (req: IValidateRequest) => {
		if (validateEmail(req.value)) return null;
		return 'Please enter a valid email address';
	},

	'exactlength': (req: IValidateRequest) => {
		let limit = Number(req.param);
		if(isNaN(limit)) return null;
		if(req.value.length === limit) return null;
		return `Must be ${limit} characters`;
	},

	'exp': (req: IValidateRequest) => {
		if (!validateCCExpiration(req.value)) {
			return 'Please enter a valid exp date MMYY';
		}
		return null;
	},

	'max': (req: IValidateRequest) => {
		let limit = Number(req.param);
		if(Number(req.value) <= limit) return null;
		return `Can not exceed ${limit} characters`;
	},

	'maxlength': (req: IValidateRequest) => {
		let limit = Number(req.param);
		if(req.value.length <= limit) return null;
		return `Can not exceed ${limit} characters`;
	},

	'min': (req: IValidateRequest) => {
		let limit = Number(req.param);
		if(Number(req.value) >= Number(req.param)) return null;
		return `Must be at least ${limit} characters`;
	},

	'minlength': (req: IValidateRequest) => {
		let limit = Number(req.param);
		if(req.value.length >= limit) return null;
		return `Must be at least ${limit} characters`;
	},

	'numeric': (req: IValidateRequest) => {
		if(validateNumber(req.value)) return null;
		return 'Must be a valid number';
	},

	'phone': (req: IValidateRequest) => {
		if(validatePhone(req.value)) return null;
		return 'Please enter a valid US phone number';
	},

	'regex': (req: IValidateRequest) => {
		let regex = new RegExp(req.param);
		if(regex.test(req.value)) return null;
		return 'Invalid format';
	},

	'required': (req: IValidateRequest) => {
		if(req.value) return null;
		return 'This field is required';
	},

	'time': (req: IValidateRequest) => {
		if(validateTime(req.value)) return null;
		return 'Please enter a valid time';
	},

	'url': (req: IValidateRequest) => {
		if(validateUrl(req.value)) return null;
		return 'Please enter a valid URL';
	},

	'url-key': (req: IValidateRequest) => {
		if (validateUrlKey(req.value)) return null;
		return 'Please enter a valid URL';
	},

	'zip': (req: IValidateRequest) => {
		if(validateZip(req.value)) return null;
		return 'Please enter a valid Zip Code';
	}
};

export const ALIASES = {
	'cc': 'creditcard',
	'numeric': 'number'
};