<template>
	<div
		:class="[`form-button btn btn-${size}`, customClass]"
		v-bind:disabled="loading || disabled"
		v-on:click="handleClick"
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

<script>
	export default {
		name: 'FormButton',
		props: {
			buttonText: String,
			customClass: {
				type: String,
				default: 'btn-default'
			},
			disabled: Boolean,
			icon: String,
			loading: {
				default: false,
				type: Boolean
			},
			loadingText: {
				type: String,
				default: 'Loading...'
			},
			margin: String,
			marginLeft: Number,
			marginRight: Number,
			size: {
				type: String,
				default: 'md'
			}
		},
		computed: {
			marginRule() {
				if(this.margin) return `margin: ${this.margin}`;
				let rule = '';
				if(typeof this.marginLeft === 'number') {
					rule += `margin-left: ${this.marginLeft}px`;
				}
				if(typeof this.marginRight === 'number') {
					rule += `margin-right: ${this.marginLeft}px`;
				}
				return rule;
			}
		},
		methods: {
			handleClick(e) {
				if(this.disabled) return;
				this.$emit('click', e)
			}
		}
	}
</script>

<style scoped>
	.form-button {
		text-shadow: none !important;
	}
</style>