<template>
    <form-field-wrapper v-bind="wrapperProps">
        <select
			class="form-control"
			v-bind:id="id"
			v-bind:value="value"
			v-bind:disabled="disabled"
			v-bind:readonly="readonly"
			v-bind:rules="rules"
			v-bind="$attrs"
			v-on="inputListeners"
        >
            <option v-if="placeholder" selected disabled>{{placeholder}}</option>
            <slot></slot>
        </select>
    </form-field-wrapper>
</template>

<script>
    import FormField from './private/FormField.vue';
	export default {
		extends: { ...FormField },
		props: {
			placeholder: String
		}
	};
</script>