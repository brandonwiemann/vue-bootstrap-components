<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div
            class="checkbox"
            v-if="!inline"
            v-for="val in values"
            v-bind:key="val">
            <label>
                <input
                    type="checkbox"
                    :name="name"
                    :checked="checkedValues.indexOf(val) > -1"
                    @change="changeVal(val)"
                />
                {{val}}
            </label>
        </div>
        <label
            class="checkbox-inline"
            v-if="inline"
            v-for="val in values"
            v-bind:key="val"
        >
            <input
                type="checkbox"
                :name="name"
                :checked="checkedValues.indexOf(val) > -1"
                @change="changeVal(val)"
            />
            {{val}}
        </label>
    </form-field-wrapper>
</template>

<script>
import FormField from './private/FormField.vue';
export default {
    extends: { ...FormField },
    name: 'Checkboxes',
    props: {
        inline: Boolean,
        name: {
            required: true,
            type: String
        },
        value: {
            required: true,
            type: Array
        },
        values: {
            required: true,
            type: Array
        }
    },
    data() {
        return {
            checkedValues: this.value
        }
    },
    methods: {
        changeVal(val) {
            if(this.checkedValues.indexOf(val) > -1) {
                this.checkedValues = this.checkedValues.filter(x => x !== val);
            } else {
                this.checkedValues.push(val);
            }
            this.$emit('input', this.checkedValues);
        }
    },
    watch: {
        value: function(newVal, oldVal) {
            this.checkedValues = newVal;
        }
    }
}
</script>