<template>
	<form-field-wrapper v-bind="wrapperProps">
		<div class="time-range">
			<timepicker-field
				:returnStringValue="returnStringValue"
				class="tr tr-left"
				:value="start"
				@input="updateStartTime"
				:placeholder="startText"
			/>
			<div class="tr-middle">to</div>
			<timepicker-field
				:returnStringValue="returnStringValue"
				class="tr tr-right"
				:value="end"
				@input="updateEndTime"
				:placeholder="endText"
			/>
		</div>
	</form-field-wrapper>
</template>

<script>
    import TimepickerField from './private/TimepickerField.vue';
    import FormField from './private/FormField.vue';
    export default {
        extends: { ...FormField },
        name: 'TimeRange',
        props: {
			end: {
				type: [String, Date],
				required: true
			},
			endText: {
				type: String,
				default: 'End Time'
			},
			returnStringValue: {
				type: Boolean,
				default: true
			},
            start: {
				type: [String, Date],
				required: true
			},
			startText: {
				type: String,
				default: 'Start Time'
			},
        },
        components: {
            TimepickerField
        },
        methods: {

			updateStartTime(time) {
				this.$emit('update:start', time)
			},

			updateEndTime(time) {
				this.$emit('update:end', time)
			}

        }
	};
</script>

<style>
	.time-range {
		display: flex;
		justify-content: space-between;
		max-width: 440px;
	}
	.tr .form-group {
		margin: 0 !important;
	}
	.tr-middle {
		font-weight: bold;
		padding-top: 6px;
	}
</style>