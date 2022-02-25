<template>
	<form-field-wrapper v-bind="wrapperProps">
		<div class="color-picker" @keydown="handleEnterTab($event)">
			<div class="input-group">
				<span
					class="input-group-addon color-preview"
					:style="{'background-color': colorString}"
					@click="showColorPicker = true"
				>
                    &nbsp;&nbsp;&nbsp;
				</span>
				<input
					data-test="input"
					type="text"
					class="form-control"
					:id="id"
					:disabled="disabled"
					:readonly="readonly"
					v-model="colorString"
					v-on="inputListeners"
					ref="_input"
				/>
			</div>
			<div class="picker-wrapper" v-if="showColorPicker">
				<chrome-color-picker
					:value="colorString"
					@input="updateColor"
				/>
			</div>
		</div>
	</form-field-wrapper>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator';
import { FormInputEvent } from '@/types/forms';
import BaseFormField from '@/components/forms/private/BaseFormField.vue';
import FormValidator from '@/classes/FormValidator';
import { Chrome } from 'vue-color';
import { jsonEquals } from '@/helpers/json.helpers';

@Component({
	name: 'Colorpicker',
	components: {
		'chrome-color-picker': Chrome
	}
})
export default class Colorpicker extends BaseFormField {

	$refs!: {
		_input: HTMLInputElement;
	}

	/* Data
	============================================*/

	colorString: string = this.value || '';
	showColorPicker: boolean = false;

	/* Computed
	============================================*/

	get inputRules(): string {
		if(typeof this.rules !== 'string') return '';
		let userRules = this.rules || '';
		if (userRules.indexOf('colorhex') > -1) return userRules;
		return `${userRules}|colorhex`;
	}

	get inputListeners(): Record<string, Function | Function[]> {
		let self = this;
		return Object.assign({}, self.$listeners, {
			input(event: FormInputEvent) {
				self.updateColor(event.target.value);
			},
			focus() {
				self.showColorPicker = true;
			}
		});
	}

	/* Methods
	============================================*/

	getValidator(): FormValidator {
		if(this.$validator && (this.$validator instanceof FormValidator)) {
			return this.$validator;
		}
		return new FormValidator();
	}

	handleEnterTab($e: KeyboardEvent) {
		if(!this.showColorPicker) return;
		if ($e.keyCode === 27) {
			this.hideColorPicker();
		} else if ($e.keyCode === 13 || $e.keyCode === 9) {
			let target = $e.target as HTMLLIElement;
			if(!target) return;
			this.updateColor(target.value);
			this.hideColorPicker();
		}
	}

	handleExternalEvents(remove = false) {
		let self = this;
		if (!remove) {
			document.body.addEventListener(
				'click',
				self.hideColorPicker.bind(this)
			);
			document.body.addEventListener(
				'keydown',
				self.handleEnterTab.bind(this)
			);
		} else {
			document.body.removeEventListener(
				'click',
				self.hideColorPicker
			);
			document.body.removeEventListener(
				'keydown',
				self.handleEnterTab
			);
		}
	}

	hideColorPicker($e?: Event) {
		if ($e) {
			if (this.$el.contains($e.target as HTMLElement)) return;
		}
		this.showColorPicker = false;
		if (!this.$refs._input) return;
		this.$refs._input.blur();
	}

	updateColor(color: any) {
		if (typeof color === 'object' && color.hex) {
			this.colorString = color.hex;
		} else if (typeof color === 'string') {
			this.colorString = color;
		} else {
			this.colorString = '';
		}
		this.$emit('input', this.colorString);
	}

	validate(): Promise<boolean> {
		return new Promise((resolve) => {
			this.error = null;
			if(!this.canValidate) resolve(true);
			this.error = this.getValidator().validate(this.inputRules, this.value);
			resolve(!this.error);
		});
	}

	/* Lifecycle Hooks
	============================================*/

	mounted() {
		this.handleExternalEvents();
	}

	beforeDestroy() {
		this.handleExternalEvents(true);
	}

	/* Watchers
	============================================*/

	@Watch('value')
	onValueChange(newVal: any, oldVal: any) {
		if(jsonEquals(newVal, oldVal)) return;
		this.updateColor(newVal);
	}

}

</script>

<style scoped>
.color-picker {
    position: relative;
	max-width: 440px;
}
.color-preview {
	cursor: pointer;
	width: 34px;
}
.picker-wrapper {
    top: 100%;
    position: absolute;
    z-index: 99;
}
</style>