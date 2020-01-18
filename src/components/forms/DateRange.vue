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

<script>
	import DatepickerField from './private/DatepickerField';
    import FormField from './private/FormField.vue';

    export default {
        extends: { ...FormField },
        name: 'DateRange',
        props: {
			end: {
				type: [String, Date],
				required: true
			},
			endText: {
				type: String,
				default: 'End Date'
			},
            start: {
				type: [String, Date],
				required: true
			},
			startText: {
				type: String,
				default: 'Start Date'
			},
			disabledDates: {
                default() {
                    return {};
                },
                type: Object
            },
            format: String,
            minDate: [String, Date],
            maxDate: [String, Date]
        },
        components: {
            DatepickerField
		},
        methods: {
			updateStartDate(date) {
				this.$emit('update:start', date)
			},

			updateEndDate(date) {
				this.$emit('update:end', date)
			},

			validate() {
				let self = this;
				self.error = null;
				return new Promise((resolve, reject) => {
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
	};
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