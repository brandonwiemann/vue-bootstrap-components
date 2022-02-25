<template>
	<div class="p-datepicker" >
		<input
			data-test="input"
			type="text"
			class="form-control"
			:id="id"
			v-model="dateString"
			:disabled="disabled"
			:readonly="readonly"
			:rules="rules"
			v-on="inputListeners"
			ref="_input"
		/>
		<div class="dp-wrapper" ref="datePickerWrapper" tabindex="-1">
			<datepicker-actual
				:disabled="disabledSettings"
				:value="date"
				:format="format"
				:inline="true"
				:bootstrap-styling="true"
				v-show="showDatepicker"
				@selected="updateDate"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { AnyObject } from '@/types/generic';
import { Component, Prop, Watch } from 'vue-property-decorator';
import DatepickerActual from 'vuejs-datepicker';
import BaseFormField from './BaseFormField.vue';

const DATE_FORMAT_REGEX = /[(\d)]{1,2}(\/|\-)[\d]{1,2}(\/|\-)[(\d)]{4}/;

@Component({
	name: 'DatepickerField',
	components: {
		DatepickerActual
	}
})
export default class DatepickerField extends BaseFormField {

	/* Props
	============================================*/

	@Prop({
		type: Object as () => AnyObject,
		required: false,
		default: () => {
			return {};
		}
	})
	readonly disabledDates: AnyObject;

	@Prop({type: String, required: false})
	readonly format: string;

	@Prop({type: [String, Date], required: false})
	readonly maxDate: string | Date;

	@Prop({type: [String, Date], required: false})
	readonly minDate: string | Date;

	@Prop({type: [String, Date], required: false})
	readonly initValue: string | Date;

	/* Data
	============================================*/

	date: Date | string | null = this.value;
	dateString: string = '';
	showDatepicker: boolean = false;

	/* Computed
	============================================*/

	get disabledSettings() {
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
	}

	get inputListeners(): AnyObject {
		let self = this;
		return Object.assign({}, self.$listeners, {
			input() {
				return;
			},
			focus() {
				self.showDatepicker = true;
			},
			blur(e: FocusEvent) {
				// prevents update running on blur when clicking on date in datepicker
				if (e.relatedTarget !== self.$refs.datePickerWrapper) {
					self.updateDate(self.dateString);
				}
			},
			keydown(event: KeyboardEvent) {
				self.handleKeyPress(event);
			},
			click() {
				self.showDatepicker = true;
			}
		});
	}

	/* Methods
	============================================*/

	handleKeyPress($e: KeyboardEvent) {
		let el = $e.target as HTMLInputElement;
		let value = el?.value;
		if($e?.keyCode === 27) {
			this.hideDatepicker();
		}
		else if($e?.keyCode === 13 || $e?.keyCode === 9) {
			this.updateDate(el.value);
			this.hideDatepicker();
		}
		else if($e.keyCode === 8) {
			if(!value || !value.match(DATE_FORMAT_REGEX)) {
				this.date = null;
				this.$emit('input', null);
			}
			this.showDatepicker = false;
		}
	}

	handleExternalEvents(remove = false) {
		let self = this;
		if(!remove) {
			document.body.addEventListener('click', self.hideDatepicker.bind(this));
		} else {
			document.body.removeEventListener('click', self.hideDatepicker);
		}
	}

	handleInitialValue(value?: string) {
		if(value) {
			let newDate = new Date(value);
			// !! Removing this conditional will result in an infinite update loop !!
			if(this.isValidDate(newDate) && (!this.date || this.date.toString() !== newDate.toString())) {
				this.date = newDate;
				this.updateDate(this.date);
			}
		} else {
			this.date = null;
		}

		if(this.date) {
			this.dateString = this.date.toLocaleString('en-us').split(',')[0];
		} else {
			this.dateString = '';
		}
	}

	hideDatepicker($e?: Event) {
		if($e) {
			if(this.$el.contains($e.target as HTMLElement)) return;
		}
		this.showDatepicker = false;
		if(!this.$refs._input) return;
		(this.$refs._input as HTMLInputElement).blur();
	}

	isValidDate(date: any) {
		if (Object.prototype.toString.call(date) === '[object Date]') {
			if (isNaN( date.getTime())) return false;
			else return true;
		} else {
			return false;
		}
	}

	updateDate(dateStr?: string | Date) {
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
			if(!(dateStr as string).match(DATE_FORMAT_REGEX)) return;
			let newDate = new Date(dateStr);
			if (this.isValidDate(newDate)) {
				this.date = newDate;
			}
		}
		if(this.date) {
			this.dateString = this.date.toLocaleString('en-us').split(',')[0];
		}
		this.$emit('input', this.date);
	}

	resolveError(resolve: (value?: unknown) => void) {
		this.$emit('error', this.error);
		resolve(!this.error);
	}

	validate(): Promise<boolean> {
		let self = this;
		return new Promise((resolve) => {
			self.error = null;
			if(!self.canValidate) return self.resolveError(resolve);
			if(!self.isRequired && !self.date && !self.value && !self.dateString) {
				self.error = null;
			}
			else if(self.isRequired && !self.date) {
				self.error = self.label + ' is required';
			}
			else if(!self.isValidDate(self.date)) {
				self.error = 'Date must be in M/D/YYYY format';
			}
			else if(self.disabledSettings.to && (self.date as Date) < self.disabledSettings.to) {
				self.error = 'Date must be on or after ' + self.disabledSettings.to.toLocaleString('en-us');
			}
			else if(self.disabledSettings.from && (self.date as Date) > self.disabledSettings.from) {
				self.error = 'Date must be on or before ' + self.disabledSettings.from.toLocaleString('en-us');
			}
			return self.resolveError(resolve);
		});
	}


	/* Lifecycle Hooks
	============================================*/

	mounted() {
		this.handleExternalEvents();
		this.handleInitialValue(this.value);

	}

	beforeDestroy() {
		this.handleExternalEvents(true);
	}

	/* Watchers
	============================================*/

	@Watch('value')
	onValueChange(newVal: any, oldVal: any) {
		if (oldVal == null
			|| newVal == null
			|| (newVal.toString() !== oldVal.toString())
		) {
			this.handleInitialValue(newVal);
		}
	}

}

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