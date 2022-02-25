<template>
	<div>
		<form-test />
	</div>
</template>

<script>
import FormTest from './FormTest.vue';
export default {
	name: 'app',
	components: {
		FormTest
	},
	computed: {
		thing() {
			return this.isSaving;
		}
	},
	data() {
		return {
			isSaving: false,
			offer: {
				headerText: '',
				startDate: '',
				endDate: ''
			}
		};
	},
	methods: {
		async saveOffer() {
			this.isSaving = true;
			let success = true;
			this.isSaving = false;
			if (success) {
				this.$emit('cancel');
			}
		}
	}

};
</script>

<style>
	html {
		font-size: 16px;
	}
	.admin-form-test {
		background-color: #f1f1f1;
		border: solid 1px #AAA;
		padding: 25px;
	}
</style>