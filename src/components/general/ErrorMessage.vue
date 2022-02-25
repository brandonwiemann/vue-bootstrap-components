<template>
	<div class="vue-error" v-if="error">
		<i class="fas fa fa-exclamation-triangle"></i> <span>{{error}}</span>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
	name: 'ErrorMessage',
})
export default class ErrorMessage extends Vue {

	/* Props
	============================================*/

	@Prop({type: String, required: false, default: ''})
	readonly error: string;

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