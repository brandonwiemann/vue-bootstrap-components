<template>
	<modal
		:size="size"
		:title="headline"
		@cancel="$emit('cancel')"
	>
		<div slot="body">
			<div class="modal-message">
				<div v-if="message">{{message}}</div>
				<slot></slot>
			</div>
		</div>
		<div slot="footer">
			<form-button
				v-for="(btn, index) in buttons"
				:key="index"
				:buttonText="btn.text"
				@click="btn.onClick"
				:icon="btn.icon"
				:loading="btn.loading"
				:loadingText="btn.loadingText ? btn.loadingText : 'Please Wait'"
				:customClass="btn.class"
			/>
			<form-button
				buttonText="Cancel"
				@click="$emit('cancel')"
				v-if="!buttons.length"
			/>
			<form-button
				buttonText="Confirm"
				@click="$emit('confirm')"
				v-if="!buttons.length"
				customClass="btn-primary"
			/>
		</div>
	</modal>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import FormButton from '../forms/FormButton.vue';
import Modal from './Modal.vue';

@Component({
	name: 'ConfirmModal',
	components: {
		FormButton,
		Modal
	}
})
export default class ConfirmModal extends Vue {

	/* Props
	============================================*/

	@Prop({
		type: Array,
		required: false,
		default: () => []
	})
	readonly buttons: IConfirmModalButton[];

	@Prop({type: String, required: false, default: 'Confirm'})
	readonly confirmText: string;

	@Prop({type: String, required: false, default: ''})
	readonly headline: string;

	@Prop({type: String, required: false, default: ''})
	readonly message: string;

	@Prop({type: String, required: false, default: 'md'})
	readonly size: string;

}

interface IConfirmModalButton {
	class: string;
	icon: string;
	text: string;
	onClick: () => any;
	loading: boolean;
	loadingText: string;
}

</script>