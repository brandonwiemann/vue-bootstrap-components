<template>
	<div class="am-tooltip-wrapper">
		<slot></slot>
		<div
			:class="['am-tooltip', {'am-tooltip-visible': show, 'am-shake': shake}]"
			ref="_tippy"
			:style="tipStyle"
			@click="calculatePosition"
		>
			<div class="am-tooltip-arrow" :style="tipArrowStyle"></div>
			<span>{{ text }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import VueScrollTo from 'vue-scrollto';

@Component({
	name: 'ToolTip',
})
export default class ToolTip extends Vue {

	$refs!: {
		_tippy: HTMLElement;
	}

	/* Props
	============================================*/

	@Prop({type: Number, required: false})
	readonly arrowSize: number;

	@Prop({type: String, required: false, default: '#565656'})
	readonly bgColor: string;

	@Prop({type: String, required: false, default: '#FFFFFF'})
	readonly fontColor: string;

	@Prop({type: String, required: false, default: 'left'})
	readonly position: string;

	@Prop({type: Boolean, required: false})
	readonly scroll: boolean;

	@Prop({type: Number, required: false, default: 100})
	readonly scrollTime: number;

	@Prop({type: Boolean, required: false, default: false})
	readonly shake: boolean;

	@Prop({type: Boolean, required: false})
	readonly show: boolean;

	@Prop({type: String, required: true})
	readonly text: string;

	@Prop({type: String, required: false, default: ''})
	readonly width: string;

	/* Data
	============================================*/

	centerX: number = 0;
	centerY: number = 0;
	positionOverride: any = null;
	positionX: number = 0;
	positionY: number = 0;
	arrowX: number = 0;
	arrowY: number = 0;

	/* Computed
	============================================*/

	get tipStyle() {
		let style = `
			background-color: ${this.bgColor};
			color: ${this.fontColor};
		`;
		if(this.width) {
			style += `max-width: ${this.width};`;
		}
		switch (this.position) {
			case 'right':
				style += `
					top: ${this.centerY}px;
					right: ${this.positionX}px;
				`;
				break;
			case 'bottom':
				style += `
					bottom: ${this.positionY}px;
					left: ${this.centerX}px;
				`;
				break;
			case 'top':
				style += `
					top: ${this.positionY}px;
					left: ${this.centerX}px;
				`;
				break;
			default:
				style += `
					top: ${this.centerY}px;
					left: ${this.positionX}px;
				`;
				break;
		}
		return style;
	}

	get tipArrowStyle() {
		let middle = Math.floor(this.arrowSize / 2) * -1;
		let style = `
			background-color: ${this.bgColor};
			color: ${this.fontColor};
			height: ${this.arrowSize}px;
			width: ${this.arrowSize}px;
		`;
		switch (this.position) {
			case 'right':
				style += `
					top: ${this.centerY}px;
					left: ${middle}px;
				`;
				break;
			case 'bottom':
				style += `
					top: ${middle}px;
					left: ${this.arrowX}px;
				`;
				break;
			case 'top':
				style += `
					bottom: ${middle}px;
					left: ${this.arrowX}px;
				`;
				break;
			default:
				style += `
					top: ${this.arrowY}px;
					right: ${middle}px;
				`;
				break;
		}
		return style;
	}

	/* Methods
	============================================*/

	calculatePosition() {
		let tip = this.$refs._tippy;
		if (!tip) return;
		let parentHeight = this.$el.clientHeight;
		let parentWidth = this.$el.clientWidth;
		let tipHeight = tip.clientHeight;
		let tipWidth = tip.clientWidth;
		this.centerY = Math.floor((parentHeight - tipHeight) / 2);
		this.centerX = Math.floor((parentWidth - tipWidth) / 2);
		this.positionX = (tipWidth + 20) * -1;
		this.positionY = (tipHeight + 10) * -1;
		this.arrowY = Math.ceil((tipHeight - 16) / 2);
		this.arrowX = Math.ceil((tipWidth - 10) / 2);
		this.$forceUpdate();
	}

	scrollToElement() {
		if (!this.scroll || !this.$refs._tippy) return;
		let el = this.position !== 'top' ? this.$el : this.$refs._tippy;
		(VueScrollTo as any).scrollTo(el, this.scrollTime, { offset: -100 });
	}

	/* Lifecycle Hooks
	============================================*/

	mounted() {
		this.calculatePosition();
	}

	/* Watchers
	============================================*/

	@Watch('show')
	onShowChange(shouldShow: boolean, wasShowing: boolean) {
		if (shouldShow === wasShowing) return;
		this.calculatePosition();
		if (shouldShow === true) {
			this.scrollToElement();
		}
	}

}

</script>

<style lang="less">
.am-tooltip-wrapper {
	position: relative;
}
.am-tooltip-arrow {
	background: #565656;
	position: absolute;
	transform: rotate(45deg);
}
.am-tooltip {
	position: absolute;
	background: #565656;
	// border: 2px solid #000;
	border-radius: 6px;
	color: #fff;
	font-size: 16px;
	max-width: 320px;
	line-height: 1.4em;
	opacity: 0;
	padding: 8px;
	pointer-events: none;
	text-align: center;
	width: 100%;
	z-index: 99;
	transition: opacity 0.3s;
	span {
		background: #565656;
		position: relative;
	}
	&.am-tooltip-visible {
		opacity: 1;
		pointer-events: auto;
		&.am-shake {
			animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
			transform: translate3d(0, 0, 0);
			backface-visibility: hidden;
			perspective: 1000px;
		}
	}
}

@keyframes shake {
	0% {
		transform: scale3d(1, 1, 1);
	}
	20%,
	60% {
		transform: rotate3d(0, 0, 1, 3deg);
	}
	40%,
	80%{
		transform: rotate3d(0, 0, 1, -3deg);
	}
	100% {
		transform: scale3d(1, 1, 1);
	}
}
</style>