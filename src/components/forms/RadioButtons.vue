<template>
    <form-field-wrapper v-bind="wrapperProps">
        <template v-if="!inline">
            <div
                class="radio"
                v-for="o in options"
                :key="o.value"
            >
                <label>
                    <input
                        type="radio"
                        :checked="radioIsChecked(o.value)"
                        :id="id"
                        :name="name"
                        :value="o.value"
                        :disabled="disabled"
                        :rules="rules"
                        @change="changeVal(o.value)"
                        v-bind="$attrs"
                    />
                    {{o.label}}
                </label>
            </div>
        </template>
        <label
            v-else
            class="radio-inline"
            v-for="o in options"
            :key="o.value"
        >
            <input
                type="radio"
                :checked="radioIsChecked(o.value)"
                :id="id"
                :name="name"
                :value="o.value"
                :disabled="disabled"
                :rules="rules"
                @change="changeVal(o.value)"
                v-bind="$attrs"
            />
            {{o.label}}
        </label>
    </form-field-wrapper>
</template>

<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import { Component, Prop } from 'vue-property-decorator';
import { hasOwnProperty } from '@/helpers/object.helpers';
import { IRadioButtonOption } from '../../types/forms';

@Component({
    name: 'RadioButtons',
})
export default class RadioButtons extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: Boolean, required: false })
    readonly inline: boolean;

    @Prop({ type: String, required: true })
    readonly name: string;

    @Prop({ type: String, required: true })
    readonly value: string;

    @Prop({ type: Array, required: true })
    readonly values: Array<IRadioButtonOption | string>;

    /* Data
	============================================*/

    /* Computed
	============================================*/

    get options(): IRadioButtonOption[] {
        if (!this.values.length) return [];
        if (typeof this.values[0] === 'object') {
            if (!hasOwnProperty(this.values[0], 'label') || !hasOwnProperty(this.values[0], 'value')) {
                console.warn('values prop on RadioButtons.vue must be an array of strings or objects with the properties "value" and "label"');
                return [];
            }
            return this.values as IRadioButtonOption[];
        }
        if (typeof this.values[0] !== 'string') {
            console.warn('values prop on RadioButtons.vue must be an array of strings or objects');
            return [] as IRadioButtonOption[];
        }
        const values = this.values as string[];
        const options: IRadioButtonOption[] = [];
        for (let i = 0;i < this.values.length;i++) {
            options.push({
                value: values[i],
                label: values[i]
            });
        }
        return options;
    }

    /* Methods
	============================================*/

    changeVal(value: string) {
        this.$emit('input', value);
    }

    radioIsChecked(value: string) {
        return this.value === value;
    }

}

</script>