import FormValidator from '@/classes/FormValidator';
import { ALIASES, VALIDATORS } from '@/constants/default-validators';
import { ValidatorFunction, IValidateRequest } from '@/types/forms';
import { hasOwnProperty } from '@/helpers/object.helpers';

describe('FormValidator', () => {

	let validator: FormValidator;

	beforeEach(() => {
		validator = new FormValidator();
	});

	it('registers default validators on construct', () => {
		let registeredValidators = Object.keys(validator.validators);
		Object.keys(VALIDATORS).forEach((validator) => {
			expect(registeredValidators).toContain(validator);
		});
	});

	it('creates default aliases on construct', () => {
		let registeredValidators = Object.keys(validator.validators);
		Object.keys(ALIASES).forEach((alias) => {
			expect(registeredValidators).toContain(alias);
		});
	});

	describe('createAlias', () => {
		if(!validator) validator = new FormValidator();
		let existing = Object.keys(validator.validators)[0];
		it('creates a new alias', () => {
			validator.createAlias(existing, 'myalias');
			expect(hasOwnProperty(validator.validators, 'myalias')).toBeTruthy();
		});
	});

	describe('registerValidator', () => {

		it('adds a new validator to validators list', () => {
			let test: ValidatorFunction = () => {
				return 'invalid';
			};
			validator.registerValidator('test', test);
			expect(hasOwnProperty(validator.validators, 'test')).toBeTruthy();
			expect(validator.validators['test']({value: 'test'})).toBe('invalid');
		});

		it('lowercases validator name', () => {
			let test: ValidatorFunction = () => {
				return null;
			};
			validator.registerValidator('TEST', test);
			expect(validator.validators['TEST']).toBe(undefined);
			expect(validator.validators['test']).toBeTruthy();
		});

	});

	describe('parseValidationString', () => {

		it('returns an empty array when string is invalid', () => {
			let rules = validator.parseValidationRuleString({} as unknown as string);
			expect(rules).toEqual([]);
		});

		it('parses a single rule', () => {
			let rules = validator.parseValidationRuleString('required');
			expect(rules.length).toBe(1);
			expect(rules[0].validator).toEqual('required');
		});

		it('parses a single rule with a parameter', () => {
			let rules = validator.parseValidationRuleString('min:1');
			expect(rules.length).toBe(1);
			expect(rules[0].validator).toBe('min');
			expect(rules[0].param).toBe('1');
		});

		it('parses multiple rules', () => {
			let rules = validator.parseValidationRuleString('required|min');
			expect(rules.length).toBe(2);
			expect(rules[0].validator).toBe('required');
			expect(rules[1].validator).toBe('min');
		});

		it('parses multiple rules with or without parameters', () => {
			let rules = validator.parseValidationRuleString('required|min:1');
			expect(rules.length).toBe(2);
			expect(rules[0].validator).toBe('required');
			expect(rules[0].param).toBe(null);
			expect(rules[1].validator).toBe('min');
			expect(rules[1].param).toBe('1');
		});

		it('lowercases validator names', () => {
			let rules = validator.parseValidationRuleString('REQUIRED');
			expect(rules.length).toBe(1);
			expect(rules[0].validator).toEqual('required');
		});
	});

	describe('validate', () => {
		let test: ValidatorFunction;
		let testValue: string = 'Good enough for me and my bobby mcgee';

		beforeEach(() => {
			test = (req: IValidateRequest) => {
				if(req.value !== testValue) return 'Nope';
				return null;
			};
			validator.registerValidator('test', test);
		});

		it('returns a string if invalid', () => {
			let result = validator.validate('test', 'Ladadadada');
			expect(result).toBe('Nope');
		});

		it('returns null if valid', () => {
			let result = validator.validate('test', testValue);
			expect(result).toBe(null);
		});
	});

});