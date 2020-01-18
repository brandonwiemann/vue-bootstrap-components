<template>
    <div v-bind:class="['form-group', {'has-error': showError}]">
        <label v-bind:for="id" v-if="label && !hideLabel" v-bind:class="{'control-label col-sm-3': isHorizontal}">
            {{label}}<span v-if="required" class="form-field-required">*</span>
            <span class="bf-helper-text bf-helper-label" v-if="helpText && !isHorizontal">
                {{helpText}}
            </span>
        </label>
        <div v-bind:class="horizontalClass">
            <slot></slot>
            <div class="bf-helper-text bf-helper-below" v-if="helpText && isHorizontal">
                {{helpText}}
            </div>
            <p class="text-danger" v-if="showError">{{error}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FormFieldWrapper',
    props: {
		colSize: String,
        error: String,
		helpText: String,
		hideLabel: Boolean,
        isHorizontal: Boolean,
        id: String,
        label: String,
		showError: Boolean,
		required: Boolean
	},
	computed: {
		horizontalClass() {
			if(!this.isHorizontal) return null;
			if(!this.colSize) return 'col-sm-9';
			return `col-sm-${this.colSize}`;
		}
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