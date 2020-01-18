<template>
   <form-field-wrapper v-bind="wrapperProps">
        <div
            v-if="!inline"
            class="radio"
            v-for="o in options"
            v-bind:key="o.value"
        >
            <label>
                <input
                    type="radio"
                    v-bind:checked="radioIsChecked(o.value)"
                    v-bind:id="id"
                    v-bind:name="name"
                    v-bind:value="o.value"
                    v-bind:disabled="disabled"
                    v-bind:rules="rules"
                    v-on:change="changeVal(o.value)"
					v-bind="$attrs"
                />
                {{o.label}}
            </label>
        </div>
        <label
            v-if="inline"
            class="radio-inline"
            v-for="o in options"
            v-bind:key="o.value"
        >
            <input
                type="radio"
                v-bind:checked="radioIsChecked(o.value)"
                v-bind:id="id"
                v-bind:name="name"
                v-bind:value="o.value"
                v-bind:disabled="disabled"
                v-bind:rules="rules"
                v-on:change="changeVal(o.value)"
				v-bind="$attrs"
            />
            {{o.label}}
        </label>
   </form-field-wrapper>
</template>

<script>
import FormField from './private/FormField.vue';
import { jsonCopy } from '../../helpers/functions';
export default {
    extends: { ...FormField },
    name: 'RadioButtons',
    props: {
        inline: Boolean,
        name: {
            required: true,
            type: String
        },
        value: {
            required: true,
            type: String
        },
        values: {
            required: true,
            type: Array
        }
	},
	computed: {
		options() {
			if(!this.values.length) return [];
			if(typeof this.values[0] === 'object') {
				if(!this.values[0].hasOwnProperty('label') || !this.values[0].hasOwnProperty('label')) {
					console.warn('values prop on RadioButtons.vue must be an array of strings or objects with the properties "value" and "label"');
					return [];
				}
				return this.values;
			}
			if(typeof this.values[0] !== 'string') {
				console.warn("values prop on RadioButtons.vue must be an array of strings or objects");
				return [];
			}
			let options = [];
			for(let i=0;i<this.values.length;i++) {
				options.push({
					value: this.values[i],
					label: this.values[i]
				});
			}
			return options;
		}
	},
    methods: {
        changeVal(value) {
            this.$emit('input', value);
		},
		radioIsChecked(value) {
			return this.value === value;
		}
    }
}
</script>

<style>

</style>