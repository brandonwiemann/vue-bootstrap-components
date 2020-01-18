<template>
	<modal :size="size"
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
				v-bind:key="index"
				:buttonText="btn.text"
				v-on:click="btn.onClick"
				:icon="btn.icon"
				:loading="btn.loading"
				:loadingText="btn.loadingText ? btn.loadingText : 'Please Wait'"
				:customClass="btn.class"
			/>
			<form-button
				buttonText="Cancel"
				v-on:click="$emit('cancel')"
				v-if="!buttons.length"
			/>
			<form-button
				buttonText="Confirm"
				v-on:click="$emit('confirm')"
				v-if="!buttons.length"
				customClass="btn-primary"
			/>
		</div>
	</modal>
</template>

<script>
	import FormButton from '../forms/FormButton.vue';
	import Modal from './Modal.vue';
	export default {
		name: 'ConfirmModal',
		components: {
			FormButton,
			Modal
		},
		props: {
			buttons: {
				type: Array,
				default() {
					return [];
				}
			},
			confirmText: {
				type: String,
				default: 'Confirm'
			},
            headline: String,
            message: String,
			size: {
				type: String,
				default: 'md'
			}
		}
	}
</script>