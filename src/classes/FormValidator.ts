import { ALIASES, VALIDATORS } from '@/constants/default-validators';
import { hasOwnProperty } from '@/helpers/object.helpers';
import { IValidatorRule, ValidatorFunction } from '@/types/forms';

export default class FormValidator {

    readonly validators: Record<string, ValidatorFunction>;

    constructor() {
        this.validators = {};
        this.registerValidators(VALIDATORS);
        this.createAliases(ALIASES);
    }

    /**
	 * Creates an alias for a validator
	 * @param validatorName The name of the validtor rule (ex: "required")
	 * @param aliasName The alias name (ex: "notnull")
	 */
    createAlias(validatorName: string, aliasName: string): void {
        if (this._validatorIsDefinedForRule(aliasName)) {
            console.warn(`Validator already declared for "${aliasName}"`);
        } else if (this._validatorIsDefinedForRule(validatorName)) {
            this.registerValidator(aliasName, this.validators[validatorName]);
        } else {
            console.warn(`Cannot create alias for ${validatorName}, validator not found`);
        }
    }

    /**
	 * Creates an aliases from a record
	 * @param aliases A record of alias definitions ( Record<validatorName, aliasName> )
	 */
    createAliases(aliases: Record<string, string>): void {
        for (const validatorName in aliases) {
            this.createAlias(validatorName, aliases[validatorName]);
        }
    }

    /**
	 * Parses a validationString into a list of ValidatorRule objects
	 * @param validationString A '|' delimited list of validation rule names
	 */
    parseValidationRuleString(validationString: string): IValidatorRule[] {
        if (!validationString || typeof validationString !== 'string') return [];
        return validationString.split('|').map(ruleString => {
            const parsed = ruleString.toLowerCase().split(':');
            return { validator: parsed[0], param: parsed[1] ?? null };
        });
    }

    /**
	 * Registers a new validation function
	 * @param name The name of the validtor
	 * @param validator The validator function
	 */
    registerValidator(name: string, validator: ValidatorFunction): void {
        name = name.toLowerCase();
        if (this._validatorIsDefinedForRule(name)) {
            // eslint-disable-next-line no-console
            console.warn(`Validator overridden for ${name}`);
        }
        this.validators[name] = validator;
    }

    /**
	 * Registers a record of validator functions
	 * @param validators A record of validator functions
	 */
    registerValidators(validators: Record<string, ValidatorFunction>): void {
        for (const rule in validators) {
            this.registerValidator(rule, validators[rule]);
        }
    }

    /**
	 * Validates a value using the rules defined in a validationString
	 * @param validationString A '|' delimited list of validation rule names
	 * @param value The form field value
	 */
    validate(validationString: string, value: string, label?: string): string | null {
        const rules = this.parseValidationRuleString(validationString);
        for (const rule of rules) {
            if (!this._validatorIsDefinedForRule(rule.validator)) continue;
            const err = this.validators[rule.validator]({ value, param: rule.param, label });
            if (err && typeof err === 'string') return err;
        }
        return null;
    }

    /* Private Methods
	============================================*/

    private _validatorIsDefinedForRule(validatorName: string): boolean {
        return hasOwnProperty(this.validators, validatorName.toLowerCase());
    }

}