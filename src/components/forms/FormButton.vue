<template>
    <div
        :class="[`form-button btn btn-${size}`, customClass]"
        :disabled="loading || disabled"
        @click="handleClick"
        :style="marginRule"
    >
        <span v-if="!loading">
            <span v-if="icon"><i :class="'fas fa fa-' + icon"></i>&nbsp;</span>
            <span v-if="buttonText">{{buttonText}}</span>
            <slot></slot>
        </span>
        <span v-if="loading"><i class="fas fa fa-spin fa-gear fa-cog"></i> {{loadingText}}</span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'FormButton',
})
export default class FormButton extends Vue {

    /* Props
	============================================*/

    @Prop({ type: String, required: false, default: '' })
    readonly buttonText: string;

    @Prop({ type: String, required: false, default: 'btn-default' })
    readonly customClass: string;

    @Prop({ type: Boolean, required: false })
    readonly disabled: boolean;

    @Prop({ type: String, required: false, default: '' })
    readonly icon: string;

    @Prop({ type: Boolean, required: false })
    readonly loading: boolean;

    @Prop({ type: String, required: false, default: 'Loading...' })
    readonly loadingText: string;

    @Prop({ type: String, required: false, default: '' })
    readonly margin: string;

    @Prop({ type: Number, required: false })
    readonly marginLeft: number;

    @Prop({ type: Number, required: false })
    readonly marginRight: number;

    @Prop({ type: String, required: false, default: 'md' })
    readonly size: string;

    /* Computed
	============================================*/

    marginRule(): string {
        if (this.margin) return `margin: ${this.margin}`;
        let rule = '';
        if (typeof this.marginLeft === 'number') {
            rule += `margin-left: ${this.marginLeft}px`;
        }
        if (typeof this.marginRight === 'number') {
            rule += `margin-right: ${this.marginLeft}px`;
        }
        return rule;
    }

    /* Methods
	============================================*/

    handleClick(e: MouseEvent) {
        if (this.disabled) return;
        this.$emit('click', e);
    }

}

</script>

<style scoped>
	.form-button {
		text-shadow: none !important;
	}
</style>