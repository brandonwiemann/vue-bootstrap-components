<template>
	<form-field-wrapper v-bind="wrapperProps">
		<div class="input-group">
			<input
				class="form-control"
				:value="value"
				:disabled="disabled"
				v-bind="$attrs"
				v-on="inputListeners"
			>
			<div class="input-group-btn">
				<button type="button" class="btn btn-default" v-show="!!value" v-on:click="clearInput">
					<i v-if="!fontAwesome" class="glyphicon glyphicon-remove"></i>
					<i v-if="fontAwesome" class="fa fas fa-times"></i>
				</button>
				<button class="btn btn-default" v-on:click="search">
					<i v-if="!fontAwesome" class="glyphicon glyphicon-search"></i>
					<i v-if="fontAwesome" class="fa fas fa-search"></i>
				</button>
			</div>
		</div>
	</form-field-wrapper>
</template>

<script>
import FormField from './private/FormField.vue';
export default {
	extends: { ...FormField },
	name: 'SearchInput',
	props: {
		searchOnInput: Boolean,
		fontAwesome: Boolean
	},
	computed: {
		inputListeners() {
			let self = this;
			return Object.assign({}, self.$listeners, {
				keydown(event) {
					self.handleEnter(event);
				},
				input(event) {
					self.handleInput(event);
				}
			});
		},
	},
	methods: {
		clearInput() {
			this.$emit('input', '')
			this.$emit('clearInput');
			this.lastSearch = null;
		},
		handleEnter(e) {
			if(e.keyCode !== 13) return;
			this.search();
		},
		handleInput(e) {
			this.$emit('input', e.target.value);
			if(this.searchOnInput) this.search();
		},
		search() {
			this.$emit('search', this.value);
		}
	}
}
</script>