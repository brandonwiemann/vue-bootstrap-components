<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div class="time-range">
            <timepicker-field
                :returnStringValue="returnStringValue"
                class="tr tr-left"
                :value="start"
                @input="updateStartTime"
                :placeholder="startText"
            />
            <div class="tr-middle">to</div>
            <timepicker-field
                :returnStringValue="returnStringValue"
                class="tr tr-right"
                :value="end"
                @input="updateEndTime"
                :placeholder="endText"
            />
        </div>
    </form-field-wrapper>
</template>


<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import TimepickerField from './private/TimepickerField.vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'TimeRange',
    components: {
        TimepickerField
    }
})
export default class TimeRange extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: [String, Date], required: true })
    readonly end: string | Date;

    @Prop({ type: String, required: false, default: 'End Time' })
    readonly endText: string;

    @Prop({ type: Boolean, required: false, default: true })
    readonly returnStringValue: boolean = true;

    @Prop({ type: [String, Date], required: true })
    readonly start: string | Date;

    @Prop({ type: String, required: false, default: 'Start Time' })
    readonly startText: string;

    @Prop({ type: String, required: false })
    readonly value: string;

    /* Methods
	============================================*/

    updateStartTime(time: string | Date) {
        this.$emit('update:start', time);
    }

    updateEndTime(time: string | Date) {
        this.$emit('update:end', time);
    }

}

</script>

<style>
	.time-range {
		display: flex;
		justify-content: space-between;
		max-width: 440px;
	}
	.tr .form-group {
		margin: 0 !important;
	}
	.tr-middle {
		font-weight: bold;
		padding-top: 6px;
	}
</style>