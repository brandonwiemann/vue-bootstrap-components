<template>
	<form-field-wrapper v-bind="wrapperProps">
		<input
			data-test="input"
			class="form-control"
			:id="id"
			:value="value"
			:disabled="disabled"
			:readonly="readonly"
			v-bind="$attrs"
			v-on="inputListeners"
		/>
	</form-field-wrapper>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import BaseFormField from './private/BaseFormField.vue';

/**
 * A standard text input field
 */
@Component({
	name: 'TextInput',
})
export default class TextInput extends BaseFormField {}

</script>