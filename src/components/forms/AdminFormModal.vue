<template>
	<modal
		:title="title"
		v-on:cancel="$emit('cancel')"
	>
		<div slot="body">
			<admin-form
				ref="_form"
				:horizontal="horizontal"
				@submit="$emit('submit')"
			>
				<slot></slot>
			</admin-form>
		</div>
		<div slot="footer">
			<slot name="additional-buttons"></slot>
			<slot name="buttons">
				<form-button
					v-if="showDeleteButton"
					v-on:click="$emit('delete')"
					customClass="btn-danger pull-left"
					icon="trash-o"
					:buttonText="deleteText"
					:loading="deleting"
					:loadingText="deletingText"
				/>
				<form-button
					:buttonText="cancelText"
					v-on:click="$emit('cancel')"
				/>
				<form-button
					customClass="btn-success"
					:buttonText="submitText"
					icon="check"
					:loading="submitting"
					:loadingText="submittingText"
					v-on:click="$refs._form.submit()"
				/>
			</slot>
		</div>
	</modal>
</template>

<script>
import AdminForm from './AdminForm.vue';
import Modal from '../general/Modal.vue';
export default {
	name: 'AdminFormModal',
	props: {
		cancelText: {
			type: String,
			default: 'Cancel'
		},
		deleteText: {
			type: String,
			default: 'Delete'
		},
		deleting: Boolean,
		deletingText: {
			type: String,
			default: 'Deleting...'
		},
		horizontal: Boolean,
        options: Object,
		submitText: {
			type: String,
			default: 'Submit'
		},
		submitting: Boolean,
		submittingText: {
			type: String,
			default: 'Submitting...'
		},
		showDeleteButton: Boolean,
		title: String
	},
	components: {
		AdminForm,
		Modal
	}
}
</script>