<template>
    <form-field-wrapper v-bind="wrapperProps">
        <datepicker-field
            v-bind="passedProps"
            v-on="listeners"
            ref="_datepicker"
        />
    </form-field-wrapper>
</template>


<script lang="ts">
import BaseFormField from '@/components/forms/private/BaseFormField.vue';
import DatepickerField from '@/components/forms/private/DatepickerField.vue';
import { Component } from 'vue-property-decorator';

@Component({
    name: 'Datepicker',
    components: {
        DatepickerField
    }
})
export default class Datepicker extends BaseFormField {

    $refs!: {
        _datepicker: DatepickerField;
    }

    /* Data
	============================================*/

    error: string | null = null;

    /* Computed
	============================================*/

    get listeners() {
        const self = this;
        return {
            ...self.$listeners,
            error(e) {
                self.error = e;
            }
        };
    }

    get passedProps() {
        const self = this;
        return {
            ...self.$props,
            error: self.error
        };
    }

    validate(): Promise<boolean> {
        return this.$refs._datepicker.validate();
    }

}

</script>