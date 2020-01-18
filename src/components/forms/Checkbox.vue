<template>
    <form-field-wrapper v-bind="wrapperProps" :hideLabel="!isHorizontal">
        <div class="checkbox">
            <label>
                <input
                    type="checkbox"
                    v-bind:name="id"
                    v-bind:id="id"
                    v-bind:disabled="disabled"
                    v-bind:rules="rules"
                    v-bind:checked="value"
                    v-on:change="$emit('input', !value)"
                />
                <span v-if="label && !isHorizontal">{{label}}</span>
            </label>
        </div>
    </form-field-wrapper>
</template>

<script>
    import FormField from './private/FormField.vue';
    import FormFieldWrapper from './private/FormFieldWrapper.vue';
	export default {
        extends: { ...FormField },
		props: {
			value: Boolean
		}
	};
</script>