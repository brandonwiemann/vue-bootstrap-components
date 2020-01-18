<template>
	<div class="p-datepicker" >
		<input
			type="text"
			class="form-control"
			v-bind:id="id"
			v-model="dateString"
			v-bind:disabled="disabled"
			v-bind:readonly="readonly"
			v-bind:rules="rules"
			v-on="inputListeners"
			ref="_input"
		/>
		<div class="dp-wrapper">
			<datepicker-actual
				:disabled="disabledSettings"
				:value="date"
				:format="format"
				:inline="true"
				:bootstrap-styling="true"
				v-show="showDatepicker"
				v-on:selected="updateDate"
			/>
		</div>
	</div>
</template>

<script>
    import DatepickerActual from 'vuejs-datepicker';
    import FormField from '../private/FormField.vue';
    const DATE_FORMAT_REGEX = /[(\d)]{1,2}(\/|\-)[\d]{1,2}(\/|\-)[(\d)]{4}/;

    export default {
        extends: { ...FormField },
        name: 'DatepickerField',
        props: {
            disabledDates: {
                default() {
                    return {};
                },
                type: Object
            },
            format: String,
            minDate: [String, Date],
			maxDate: [String, Date],
			initValue: [String, Date]
        },
        components: {
            DatepickerActual
        },
        computed: {
            disabledSettings() {
                let obj = { ...this.disabledDates };
                let { minDate, maxDate } = this;
                if(minDate) {
                    if(typeof minDate === 'object') obj.to = minDate;
                    else obj.to = new Date(minDate);
                }
                if(maxDate) {
                    if(typeof maxDate === 'object') obj.from = maxDate;
                    else obj.from = new Date(maxDate);
                }
                return obj;
			},
			inputListeners() {
				let self = this;
				return Object.assign({}, self.$listeners, {
					input() {
						return;
					},
					focus() {
						self.showDatepicker = true;
					},
					keydown(event) {
						self.handleKeyPress(event);
					},
					click() {
						self.showDatepicker = true;
					}
				});
			}
        },
        data() {
            return {
                date: this.value,
                dateString: null,
                showDatepicker: false
            }
        },
        methods: {

            handleKeyPress($e) {
				let value = $e.target.value;
                if($e, $e.keyCode === 27) {
                    this.hideDatepicker();
                }
                else if($e.keyCode === 13 || $e.keyCode === 9) {
                    this.updateDate($e.target.value);
                    this.hideDatepicker();
				}
				else if($e.keyCode === 8) {
					if(!value || !value.match(DATE_FORMAT_REGEX)) {
						this.date = null;
						this.$emit('input', null);
					}
					this.showDatepicker = false;
				}
				else if(value.match(/[0-9 \/]/)) {
					this.showDatepicker = false;
					this.updateDate(value);
				}
				else {
					this.updateDate(value);
				}
            },

            handleExternalEvents(remove = false) {
                let self = this;
                if(!remove) {
                    document.body.addEventListener('click', self.hideDatepicker.bind(this));
                } else {
                    document.body.removeEventListener('click', self.hideDatepicker);
                }
			},

			handleInitialValue(value) {
				if(value) {
					let newDate = new Date(value);
					// !! Removing this conditional will result in an infinite update loop !!
					if(this.isValidDate(newDate) && (!this.date || this.date.toString() !== newDate.toString())) {
						this.date = newDate;
						this.updateDate(this.date);
					}
				}
				if(this.date) {
					this.dateString = this.date.toLocaleString('en-us').split(',')[0];
				}
			},

            hideDatepicker($e) {
				if($e) {
					if(this.$el.contains($e.target)) return;
				}
                this.showDatepicker = false;
				if(!this.$refs._input) return;
                this.$refs._input.blur();
            },

			isValidDate(date) {
				if (Object.prototype.toString.call(date) === "[object Date]") {
					if (isNaN( date.getTime())) return false;
					else return true;
				} else {
					return false;
				}
			},

            updateDate(dateStr) {
				if(!dateStr) {
					this.date = null;
					this.$emit('input', null);
					return;
				}
                if(dateStr !== null && typeof dateStr === 'object') {
                    this.date = dateStr;
                    this.showDatepicker = false;
                } else {
                    this.date = null;
                    if(!dateStr.match(DATE_FORMAT_REGEX)) return;
                    let newDate = new Date(dateStr);
                    if (this.isValidDate(newDate)) {
						this.date = newDate;
                    }
				}
				if(this.date) {
					this.dateString = this.date.toLocaleString('en-us').split(',')[0];
				}
                this.$emit('input', this.date);
			},

			resolveError(resolve) {
				this.$emit('error', this.error);
				resolve(!this.error);
			},

			validate() {
				let self = this;
				return new Promise((resolve, reject) => {
					self.error = null;
					if(!self.canValidate) return self.resolveError(resolve);
					let required = self.rules && self.rules.indexOf('required') > -1;
					if(!required && !self.date && !self.value && !self.dateString) {
						self.error = null;
					}
					else if(required && !self.date) {
						self.error = self.label + ' is required';
					}
					else if(!self.isValidDate(self.date)) {
						self.error = 'Date must be in M/D/YYYY format';
					}
					else if(self.disabledSettings.to && self.date < self.disabledSettings.to) {
						self.error = 'Date must be on or after ' + self.disabledSettings.to.toLocaleString('en-us');
					}
					else if(self.disabledSettings.from && self.date > self.disabledSettings.from) {
						self.error = 'Date must be on or before ' + self.disabledSettings.from.toLocaleString('en-us');
					}
					return self.resolveError(resolve);
				});
			}

        },
		mounted() {
			this.handleExternalEvents();
			this.handleInitialValue(this.value);

		},
        beforeDestroy() {
            this.handleExternalEvents(true);
		},
		watch: {
			value(newVal, oldVal) {
				if (oldVal == null
					|| newVal == null
					|| (newVal.toString() !== oldVal.toString())
				) {
					this.handleInitialValue(newVal);
				}
			}
		}
	};
</script>

<style scoped>
    .p-datepicker {
        position: relative;
		max-width: 440px;
    }
    .dp-wrapper {
		z-index: 99;
        position: absolute;
    }
</style>