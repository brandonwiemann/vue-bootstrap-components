<template>
    <form-field-wrapper v-bind="wrapperProps" :hideLabel="!isHorizontal">
        <div class="checkbox">
            <label>
                <input
                    type="checkbox"
                    :name="id"
                    :id="id"
                    :disabled="disabled"
                    :rules="rules"
                    :checked="value"
                    @change="$emit('input', !value)"
                />
                <span v-if="label && !isHorizontal">{{label}}</span>
            </label>
        </div>
    </form-field-wrapper>
</template>


<script lang="ts">
import BaseFormField from '@/components/forms/private/BaseFormField.vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'Checkbox'
})
export default class Checkbox extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: Boolean, required: false })
    readonly value: boolean;

    /* Methods
	============================================*/

    validate(): Promise<boolean> {
        return Promise.resolve(true);
    }

}

</script>