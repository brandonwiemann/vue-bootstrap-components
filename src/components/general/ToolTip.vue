<template>
	<div class="am-tooltip-wrapper">
		<slot></slot>
		<div
			:class="['am-tooltip', {'am-tooltip-visible': show, 'am-shake': shake}]"
			ref="_tippy"
			:style="tipStyle"
			@click="calculatePosition"
		>
			<div class="am-tooltip-arrow" :style="tipArrowStyle"/>
			<span>{{ text }}</span>
		</div>
	</div>
</template>

<script>
import VueScrollTo from "vue-scrollto";
export default {
	name: "ToolTip",
	props: {
		arrowSize: {
			type: Number,
			default: 16
		},
		bgColor: {
			type: String,
			default: "#565656"
		},
		fontColor: {
			type: String,
			default: "#FFFFFF"
		},
		text: {
			type: String,
			required: true
		},
		position: {
			type: String,
			default: "left"
		},
		shake: {
			type: Boolean,
			default: true
		},
		show: Boolean,
		scroll: Boolean,
		scrollTime: {
			type: Number,
			default: 300
		},
		width: String,
	},
	computed: {
		tipStyle() {
			let style = `
                background-color: ${this.bgColor};
                color: ${this.fontColor};
			`;
			if(this.width) {
                style += `max-width: ${this.width};`
            }
			switch (this.position) {
				case "right":
					style += `
                        top: ${this.centerY}px;
                        right: ${this.positionX}px;
                    `;
					break;
				case "bottom":
					style += `
                        bottom: ${this.positionY}px;
                        left: ${this.centerX}px;
                    `;
					break;
				case "top":
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
		},
		tipArrowStyle() {
			let middle = Math.floor(this.arrowSize / 2) * -1;
			let style = `
                background-color: ${this.bgColor};
                color: ${this.fontColor};
                height: ${this.arrowSize}px;
                width: ${this.arrowSize}px;
            `;
			switch (this.position) {
				case "right":
					style += `
                        top: ${this.centerY}px;
                        left: ${middle}px;
                    `;
					break;
				case "bottom":
					style += `
                        top: ${middle}px;
                        left: ${this.arrowX}px;
                    `;
					break;
				case "top":
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
	},
	data() {
		return {
			centerX: 0,
			centerY: 0,
			positionOverride: null,
			positionX: 0,
			positionY: 0,
			arrowX: 0,
			arrowY: 0
		};
	},
	methods: {
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
		},

		scrollToElement() {
			if (!this.scroll || !this.$refs._tippy) return;
			let el = this.position !== 'top' ? this.$el : this.$refs._tippy;
			VueScrollTo.scrollTo(el, this.scrollTime, { offset: -100 });
		}
	},
	mounted() {
		this.calculatePosition();
	},
	watch: {
		show(shouldShow, wasShowing) {
			if (shouldShow === wasShowing) return;
			this.calculatePosition();
			if (shouldShow === true) {
				this.scrollToElement();
			}
		}
	}
};
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
