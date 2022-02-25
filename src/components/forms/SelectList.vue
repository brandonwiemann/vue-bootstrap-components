<template>
    <form-field-wrapper v-bind="wrapperProps">
        <select
            class="form-control"
            :id="id"
            :value="value"
            :disabled="disabled"
            :readonly="readonly"
            :rules="rules"
            v-bind="$attrs"
            v-on="inputListeners"
        >
            <option v-if="placeholder" selected disabled>{{placeholder}}</option>
            <slot></slot>
        </select>
    </form-field-wrapper>
</template>


<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'SelectList',
})
export default class SelectList extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: String, required: false })
    readonly placeholder: string;

}

</script>