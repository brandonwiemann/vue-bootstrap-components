<template>
	<div></div>
</template>

<script lang="ts">

import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import FormFieldWrapper from './FormFieldWrapper.vue';
import FormValidator from '@/classes/FormValidator';
import { AnyObject } from '@/types/generic';
import { FormInputEvent, IValidateableComponent } from '@/types/forms';

@Component({
	name: 'FormField',
	components: {
		FormFieldWrapper
	}
})
export default class BaseFormField extends Vue implements IValidateableComponent  {

	$validator!: FormValidator;

	/* Props
	============================================*/

	/**
	 * Custom asynchronous validation function
	 */
	@Prop({type: Function, required: false})
	readonly asyncValidator: (value: string) => Promise<string | boolean>;

	/**
	 * Length of async validation debounce time in ms
	 */
	@Prop({type: Number, required: false, default: 250})
	readonly asyncDebounce: number;

	/**
	 * The bootstrap column size
	 */
	@Prop({type: String, required: false})
	readonly colSize: string;

	/**
	 * User interfaction is disabled when true
	 */
	@Prop({type: Boolean, required: false})
	readonly disabled: boolean;

	/**
	 * Supplemental text to display near field label
	 */
	@Prop({type: String, required: false})
	readonly helpText: string;

	/**
	 * Hides the field label when true
	 */
	@Prop({type: Boolean, required: false})
	readonly hideLabel: boolean;

	/**
	 * Field label is horizontally aligned with input when true
	 */
	@Prop({type: Boolean, required: false})
	readonly horizontal: boolean;

	/**
	 * The input id attribute
	 */
	@Prop({
		type: String,
		required: false,
		default() {
			return Math.random().toString(36).substr(2, 10);
		},
	})
	readonly id: string;

	/**
	 * The class attribute for the input element
	 */
	@Prop({type: String, required: false})
	readonly inputClass: string;

	/**
	 * The field label
	 */
	@Prop({type: String, required: false})
	readonly label: string;

	/**
	 * Readonly attribute
	 */
	@Prop({type: Boolean, required: false})
	readonly readonly: boolean;

	/**
	 * Validation rule string or custom validation function
	 */
	@Prop({type: [Function, String], required: false})
	readonly rules: string | ((x: string) => string | null);

	/**
	 * The field value for use with v-model
	 */
	@Prop({required: true})
	readonly value: any;

	/**
	 * [DEPRECATED] A custom validation function
	 */
	@Prop({type: Function, required: false})
	readonly validator: (x: string) => string | null;

	/* Data
	============================================*/

	canValidate: boolean = false;
	isHorizontal: boolean = false;
	error: string | null = null;
	validateTimer: number = 0;

	/* Computed
	============================================*/

	get inputListeners(): AnyObject {
		let self = this;
		return Object.assign({}, self.$listeners, {
			change(event: FormInputEvent) {
				self.updateVal(event);
				self.updateVal(event, 'change');
			},
			input(event: FormInputEvent) {
				self.updateVal(event);
			}
		});
	}
	get isRequired(): boolean {
		return typeof this.rules === 'string'
			&& this.rules.indexOf('required') > -1;
	}
	get showError(): boolean {
		return !!this.error && this.canValidate;
	}
	get wrapperProps() {
		return {
			colSize: this.colSize,
			isHorizontal: this.isHorizontal,
			helpText: this.helpText,
			hideLabel: this.hideLabel,
			label: this.label,
			error: this.error,
			showError: this.showError,
			required: this.isRequired
		};
	}

	/* Methods
	============================================*/

	protected getValidator(): FormValidator {
		if(this.$validator && (this.$validator instanceof FormValidator)) {
			return this.$validator;
		}
		this.$validator = new FormValidator();
		return this.$validator;
	}

	protected updateVal(event: FormInputEvent, eventType = 'input') {
		let val = event.target?.value;
		this.$emit(eventType, val);
	}

	private warnDeprecated() {
		if(this.validator && (typeof this.validator === 'function')) {
			console.warn('Validator prop is deprecated, use rules instead.');
		}
	}

	/* Validation
	============================================*/

	public validate(): Promise<boolean> {
		this.error = null;
		return new Promise((resolve) => {

			if(!this.valueCanBeValidated()) {
				resolve(null);
			}

			else if (typeof this.rules === 'string') {
				this.error = this.getValidator().validate(this.rules, this.value, this.label);
			}

			else if(typeof this.rules === 'function') {
				this.error = this.rules(this.value);
			}

			if(!this.error && this.asyncValidator) {
				return this.validateAsyncAndResolve(resolve);
			}

			resolve(this.error === null);
		});
	}

	private validateAsyncAndResolve(resolve: (value?: unknown) => void) {
		let delay = this.validateTimer === null ? 0 : this.asyncDebounce;
		if(this.validateTimer) clearTimeout(this.validateTimer);
		this.validateTimer = setTimeout(() => {
			this.asyncValidator(this.value).then(resolve);
		}, delay);
	}

	private valueCanBeValidated() {
		if(!this.canValidate) return false;
		if(!!this.value && typeof this.value !== 'string') {
			console.warn('Cannot validate non-string value in default BaseFormField validator');
			return false;
		}
		return !!this.rules || !!this.asyncValidator;
	}

	/* Lifecycle Hooks
	============================================*/

	mounted() {
		this.isHorizontal = this.horizontal;
		this.warnDeprecated();
	}

	/* Watchers
	============================================*/

	@Watch('value')
	onValueChange(newVal: string, oldVal?: string) {
		if(newVal !== oldVal) {
			this.validate();
		}
	}

	@Watch('rules')
	onRulesChange(newVal: string, oldVal?: string) {
		if(newVal !== oldVal) {
			this.validate();
		}
	}

	@Watch('horizontal')
	onHorizontalChange(isHorizontal: boolean, wasHorizontal?: boolean) {
		if(isHorizontal !== wasHorizontal) {
			this.isHorizontal = isHorizontal;
		}
	}

}

</script>