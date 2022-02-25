<template>
    <form-field-wrapper v-bind="wrapperProps">
        <textarea
            data-test="input"
            class="form-control"
            :id="id"
            :value="value"
            :disabled="disabled"
            :readonly="readonly"
            :rules="rules"
            :rows="rows"
            v-bind="$attrs"
            v-on="inputListeners"
        >
        </textarea>
    </form-field-wrapper>
</template>
<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'TextAreaInput',
})
export default class TextAreaInput extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: Number, required: false })
    readonly maxLength: number;

    @Prop({ type: Number, required: false })
    readonly minLength: number;

    @Prop({ type: Number, required: false, default: 5 })
    readonly rows: number;

}

</script>

<style scoped>
    textarea {
        resize: vertical;
        width: 100%;
    }
</style>