<template>
    <div :class="['form-group', {'has-error': showError}]" data-test="form-field-wrapper">
        <label :for="id" v-if="label && !hideLabel" :class="{'control-label col-sm-3': isHorizontal}">
            {{label}}<span v-if="required" class="form-field-required">*</span>
            <span class="bf-helper-text bf-helper-label" v-if="helpText && !isHorizontal">
                {{helpText}}
            </span>
        </label>
        <div :class="horizontalClass">
            <slot></slot>
            <div class="bf-helper-text bf-helper-below" v-if="helpText && isHorizontal">
                {{helpText}}
            </div>
            <p class="text-danger" v-if="showError">{{error}}</p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'FormFieldWrapper',
})
export default class FormFieldWrapper extends Vue {

    /* Props
	============================================*/

    /**
	 * The bootstrap column size
	 */
    @Prop({ type: String, required: false })
    readonly colSize: string;

    /**
	 * An error message to display below the field
	 */
    @Prop({ type: String, required: false })
    readonly error: string;

    /**
	 * Supplemental text to display near field label
	 */
    @Prop({ type: String, required: false })
    readonly helpText: string;

    /**
	 * Hides the field label when true
	 */
    @Prop({ type: Boolean, required: false })
    readonly hideLabel: boolean;

    /**
	 * Field label is horizontally aligned with input when true
	 */
    @Prop({ type: Boolean, required: false })
    readonly isHorizontal: boolean

    /**
	 * The id of the input field
	 */
    @Prop({ type: String, required: false })
    readonly id: string

    /**
	 * The field label
	 */
    @Prop({ type: String, required: false })
    readonly label: string

    /**
	 * Whether or not the wrapped input is required
	 */
    @Prop({ type: Boolean, required: false })
    readonly required: boolean

    /**
	 * Adds error class and displays error when true
	 */
    @Prop({ type: Boolean, required: false })
    readonly showError: boolean


    /* Computed
	============================================*/

    get horizontalClass(): string | null {
        if (!this.isHorizontal) return null;
        if (!this.colSize) return 'col-sm-9';
        return `col-sm-${this.colSize}`;
    }

}

</script>


<style scoped>
	.bf-helper-text {
		color: #999999;
		font-size: 12px;
		font-weight: normal;
	}
    .bf-helper-below {
        margin-top: 3px;
    }
	.form-field-required {
		color: red;
		font-size: 14px;
		position: relative;
		top: -2px;
	}
	p.text-danger {
		margin: 0;
	}
</style>