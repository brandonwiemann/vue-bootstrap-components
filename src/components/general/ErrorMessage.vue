<template>
	<div class="vue-error" v-if="error">
		<i class="fas fa fa-exclamation-triangle"></i> <span>{{error}}</span>
	</div>
</template>

<script>
	export default {
		name: 'ErrorMessage',
		props: {
			error: String
		},
	}
</script>

<style scoped>
	.vue-error {
		align-items: center;
		background-color: #fff2f2;
		border: solid 1px #d40904;
		display: flex;
		font-size: 14px;
		padding: 8px;
		color: #d40904;
		margin-bottom: 15px;
	}
    .vue-error i.fa {
        margin-right: 5px;
        font-size: 20px;
    }
</style>