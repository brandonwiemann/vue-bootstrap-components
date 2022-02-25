<template>
	<form-field-wrapper v-bind="wrapperProps">
		<timepicker-field
			v-bind="$props"
			v-on="$listeners"
		/>
	</form-field-wrapper>
</template>


<script lang="ts">
import { Component } from 'vue-property-decorator';
import TimepickerField from './private/TimepickerField.vue';
import BaseFormField from './private/BaseFormField.vue';

@Component({
	name: 'Timepicker',
	components: {
		TimepickerField
	}
})
export default class Timepicker extends BaseFormField {
	validate(): Promise<boolean> {
		return Promise.resolve(true);
	}
}
</script>