<template>
    <form-field-wrapper v-bind="wrapperProps">
		<div class="pm-slider-wrapper">
			<input
				class="pm-slider"
				type="range"
				:disabled="disabled"
				:min="min"
				:max="max"
				:value="value"
				v-bind="$attrs"
				v-on="inputListeners"
			/>
			<div class="pm-slider-amount" v-if="!hideAmount">
				{{value}} {{units}}
			</div>
		</div>
    </form-field-wrapper>
</template>

<script>
    import FormField from './private/FormField.vue';
	export default {
        extends: { ...FormField },
		props: {
			max: {
				type: Number,
				default: 100
			},
			min: {
				type: Number,
				default: 0
			},
			hideAmount: Boolean,
			units: {
				type: String,
				default: '%'
			}
		}
	};
</script>

<style>
	.pm-slider-wrapper {
		width: 100%;
		padding: 10px 0;
	}

	.pm-slider {
		-webkit-appearance: none;
		width: 100%;
		height: 10px;
		background: #d3d3d3;
		outline: none;
		opacity: 0.7;
		-webkit-transition: .2s;
		transition: opacity .2s;
	}

	.pm-slider:hover {
		opacity: 1;
	}

	.pm-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		background: #2e6da4;
		border-radius: 50%;
		cursor: pointer;
	}

	.pm-slider::-moz-range-thumb {
		width: 20px;
		height: 20px;
		background: #2e6da4;
		border-radius: 50%;
		cursor: pointer;
	}

	.pm-slider-amount {
		text-align: center;
	}
</style>