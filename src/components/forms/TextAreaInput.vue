<template>
	<form-field-wrapper v-bind="wrapperProps">
        <textarea
            class="form-control"
            v-bind:id="id"
            v-bind:value="value"
            v-bind:disabled="disabled"
            v-bind:readonly="readonly"
            v-bind:rules="rules"
			v-bind:rows="rows"
			v-bind="$attrs"
            v-on="inputListeners"
        >
        </textarea>
	</form-field-wrapper>
</template>

<script>
    import FormField from './private/FormField.vue';
	export default {
        extends: { ...FormField },
		props: {
            maxLength: Number,
            minLength: Number,
			rows: {
				default: 5,
				required: false,
				type: Number
			}
		}
	};
</script>

<style scoped>
    textarea {
        resize: vertical;
        width: 100%;
    }
</style>