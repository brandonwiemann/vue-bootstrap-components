<template>
    <form-field-wrapper v-bind="wrapperProps">
        <input
            class="form-control"
            v-bind:id="id"
            v-bind:value="value"
            v-bind:disabled="disabled"
            v-bind:readonly="readonly"
			v-bind="$attrs"
            v-on="inputListeners"
        />
    </form-field-wrapper>
</template>

<script>
    import FormField from './private/FormField.vue';
	export default {
		extends: { ...FormField }
	}
</script>