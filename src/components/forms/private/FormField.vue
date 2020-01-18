<template>
    <div></div>
</template>

<script>
    import FormFieldWrapper from './FormFieldWrapper.vue';
    import validator from '../../../helpers/form-validator';
    import { isPromise } from '../../../helpers/functions';
    export default {
        props: {
			asyncValidator: Function,
			asyncDebounce: {
				type: Number,
				default: 250
			},
			colSize: String,
            disabled: Boolean,
            helpText: String,
			hideLabel: Boolean,
            horizontal: Boolean,
            id: {
                default() {
                    return Math.random().toString(36).substr(2, 10);
                },
                type: String
            },
			inputClass: String,
            label: String,
            readonly: Boolean,
            rules: {
                default: null,
                type: [String, Function]
            },
			value: {},
			validator: Function
        },
        components: {
            FormFieldWrapper
        },
        computed: {
			inputListeners() {
				let self = this;
				return Object.assign({}, self.$listeners, {
					change(event) {
						self.updateVal(event);
						self.updateVal(event, 'change');
					},
					input(event) {
						self.updateVal(event);
					}
				});
			},
			isRequired() {
				return typeof this.rules === 'string'
					&& this.rules.indexOf('required') > -1;
			},
            showError() {
                return !!this.error && this.canValidate;
			},
			wrapperProps() {
				return {
					colSize: this.colSize,
					isHorizontal: this.isHorizontal,
					helpText: this.helpText,
					hideLabel: this.hideLabel,
					label: this.label,
					error: this.error,
					showError: this.showError,
					required: this.isRequired
				}
			}
        },
        data() {
            return {
				canValidate: false,
				isHorizontal: false,
				error: null,
				valid: true,
				validateTimer: null
            };
        },
        methods: {

			resolveValidation(error, resolve) {
				this.error = error;
				resolve(this.error === null);
			},

            validate() {
				let self = this;
                return new Promise((resolve, reject) => {
					let error = null;
                    // self.error = null;
                    if(!self.canValidate) {
						return self.resolveValidation(error, resolve);
					}

                    // Allow for custom validator function
                    if(self.validator && (typeof self.validator === 'function')) {
                        console.warn(`Validator is deprecated, use rules instead.`);
                        error = self.validator(self.value);
                    }

                    // If no custom error, fallback to default validator
                    if(error === null) {

                        if(!self.rules && !self.asyncValidator) {
							return self.resolveValidation(error, resolve);
						}

						else if (typeof self.rules === 'string') {
							error = validator.validate(self.rules, self.value, self.label);
						}

						else if(typeof self.rules === 'function') {
							error = self.rules(self.value);
						}

						if(error) {
							return self.resolveValidation(error, resolve);
						}

						else if(self.asyncValidator) {
							if(self.validateTimer) {
								clearTimeout(self.validateTimer);
							}
							self.validateTimer = setTimeout(() => {
								self.asyncValidator(self.value).then((err) => {
									error = err;
									if (error !== null) {
										self.$emit('error', error);
									}
									return self.resolveValidation(error, resolve);
								});
							}, self.validateTimer === null ? 0 : self.asyncDebounce);
							return;
						}

					}

                    // Unsuccessful validation
                    if(error !== null) {
                        self.$emit('error', error);
                    }

                    self.resolveValidation(error, resolve);
                })
			},

            updateVal(event, eventType = 'input') {
                let val = event.target.value;
                this.$emit(eventType, val);
			}

		},
		mounted() {
			this.isHorizontal = this.horizontal;
		},
        watch: {
            value: function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.validate();
                }
            },
            rules: function(newVal, oldVal) {
                if(newVal !== oldVal) {
                    this.validate();
                }
			},
			horizontal: function(isHorizontal, wasHorizontal) {
				if(isHorizontal !== wasHorizontal) {
					this.isHorizontal = isHorizontal;
				}
			}
        }
    };
</script>