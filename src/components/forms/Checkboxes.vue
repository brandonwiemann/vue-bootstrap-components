<template>
	<form-field-wrapper v-bind="wrapperProps">
		<template v-if="!inline">
			<div
				class="checkbox"
				v-for="val in values"
				:key="val">
				<label>
					<input
						type="checkbox"
						:name="name"
						:checked="checkedValues.indexOf(val) > -1"
						@change="changeVal(val)"
					/>
					{{ val }}
				</label>
			</div>
		</template>
		<template v-else>
			<label
				class="checkbox-inline"
				v-for="val in values"
				:key="val"
			>
				<input
					type="checkbox"
					:name="name"
					:checked="checkedValues.indexOf(val) > -1"
					@change="changeVal(val)"
				/>
				{{ val }}
			</label>
		</template>
	</form-field-wrapper>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseFormField from '@/components/forms/private/BaseFormField.vue';
import { jsonEquals } from '@/helpers/json.helpers';

@Component({
	name: 'Checkboxes',
})
export default class Checkboxes extends BaseFormField {

	/* Props
	============================================*/

	@Prop({type: Boolean, required: false})
	readonly inline: boolean

	@Prop({type: String, required: true})
	readonly name: string;

	@Prop({type: Array, required: true})
	readonly value: string[];

	@Prop({type: Array, required: true})
	readonly values: string[];

	/* Data
	============================================*/

	checkedValues: string[] = this.value;

	/* Methods
	============================================*/

	changeVal(val: string) {
		if(this.checkedValues.indexOf(val) > -1) {
			this.checkedValues = this.checkedValues.filter(x => x !== val);
		} else {
			this.checkedValues.push(val);
		}
		this.$emit('input', this.checkedValues);
	}

	validate(): Promise<boolean> {
		if(this.isRequired && !this.value?.length) {
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
	}

	/* Watchers
	============================================*/

	@Watch('value')
	onValueChange(newVal: any, oldVal: any) {
		if(jsonEquals(newVal, oldVal)) return;
		this.checkedValues = newVal;
	}

}

</script>