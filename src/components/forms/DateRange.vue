<template>
	<form-field-wrapper v-bind="wrapperProps">
		<div class="date-range">
			<datepicker-field
				class="dr dr-left"
				:value="start"
				@input="updateStartDate"
				:minDate="minDate"
				:maxDate="end"
				:placeholder="startText"
				ref="startDateField"
				:rules="rules"
				label="Start Date"
			/>
			<div class="dr-middle">to</div>
			<datepicker-field
				class="dr dr-right"
				:value="end"
				@input="updateEndDate"
				:minDate="start"
				:maxDate="maxDate"
				:placeholder="endText"
				ref="endDateField"
				:rules="rules"
				label="End Date"
			/>
		</div>
	</form-field-wrapper>
</template>


<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import BaseFormField from './private/BaseFormField.vue';
import DatepickerField from './private/DatepickerField.vue';
import { AnyObject } from '@/types/generic';

@Component({
	name: 'DateRange',
	components: {
		DatepickerField
	}
})
export default class DateRange extends BaseFormField {

	$refs!: {
		startDateField: DatepickerField;
		endDateField: DatepickerField;
	}

	/* Props
	============================================*/

	@Prop({type: [String, Date], required: true})
	readonly end: string | Date;

	@Prop({type: String, required: false})
	readonly endText: string;

	@Prop({type: [String, Date], required: true})
	readonly start: string | Date;

	@Prop({type: String, required: false})
	readonly startText: string;

	@Prop({type: Object as () => AnyObject, required: false})
	readonly disabledDates: AnyObject;

	@Prop({type: String, required: false})
	readonly format: string;

	@Prop({type: [String, Date], required: false})
	readonly maxDate: string | Date;

	@Prop({type: [String, Date], required: false})
	readonly minDate: string | Date;

	@Prop({type: String, required: false})
	readonly value: string;

	/* Methods
	============================================*/

	updateStartDate(date: string | Date) {
		this.$emit('update:start', date);
	}

	updateEndDate(date: string | Date) {
		this.$emit('update:end', date);
	}

	validate(): Promise<boolean> {
		let self = this;
		self.error = null;
		return new Promise((resolve) => {
			self.$refs.startDateField.validate().then((isValid) => {
				if (!isValid) {
					this.error = self.$refs.startDateField.error;
					return resolve(false);
				}
				self.$refs.endDateField.validate().then((isValid) => {
					if (!isValid) {
						this.error = self.$refs.endDateField.error;
						return resolve(false);
					}
					return resolve(true);
				});
			});
		});
	}

}

</script>

<style>
	.date-range {
		display: flex;
		max-width: 440px;
	}
	.dr {
		flex: 0 0 46%;
	}
	.dr .form-group {
		margin: 0 !important;
	}
	.dr-left input.form-control {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
	.dr-right input.form-control {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	.dr-middle {
		align-items: center;
		background-color: #eee;
		border: solid 1px #ccc;
		display: flex;
		justify-content: center;
		height: 34px;
		width: 35px;
	}
</style>