<template>
	<form-field-wrapper v-bind="wrapperProps">
        <datepicker-field
			v-bind="passedProps"
            v-on="listeners"
        />
    </form-field-wrapper>
</template>

<script>
import DatepickerField from './private/DatepickerField';
import FormField from './private/FormField.vue';
export default {
	extends: {...FormField},
	name: 'Datepicker',
	components: {
		DatepickerField
	},
	computed: {
		listeners() {
			let self = this;
			return {
				...self.$listeners,
				error(e) {
					self.error = e;
				}
			}
		},
		passedProps() {
			let self = this;
			return {
				...self.$props,
				error: self.error
			}
		}
	},
	data() {
		return {
			error: null
		}
	}
}
</script>