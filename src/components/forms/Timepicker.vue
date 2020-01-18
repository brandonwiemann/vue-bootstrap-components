<template>
	<form-field-wrapper v-bind="wrapperProps">
        <timepicker-field
			v-bind="$props"
            v-on="$listeners"
        />
    </form-field-wrapper>
</template>

<script>
import TimepickerField from './private/TimepickerField';
import FormField from './private/FormField.vue';
export default {
	extends: {...FormField},
	name: 'Timepicker',
	components: {
		TimepickerField
	}
}
</script>