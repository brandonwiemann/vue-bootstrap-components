<template>
	<transition name="vue-modal">
		<div id="myModal" class="modal vue-bs-modal" role="dialog">
			<div :class="['modal-dialog', 'modal-' + size]">
				<div class="modal-content">
					<div class="modal-header" v-if="title || $slots.header">
						<button type="button" class="close" @click="$emit('cancel')">&times;</button>
						<h4 class="modal-title" v-if="title">{{title}}</h4>
						<slot name="header"></slot>
					</div>
					<div class="modal-body">
						<slot name="body"></slot>
						<br/>
						<error-message :error="error" />
					</div>
					<div class="modal-footer">
						<slot name="footer">
							<button type="button" class="btn btn-default" @click="$emit('cancel')">Close</button>
						</slot>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import ErrorMessage from './ErrorMessage.vue';
	export default {
		components: {
			ErrorMessage
		},
		props: {
			error: {
				type: String,
				default: null
			},
			className: {
				default: "",
				type: String
			},
			onCancel: {
				type: Function,
				required: false
			},
			size: {
				default: "md",
				type: String
			},
			title: String
		},
		methods: {
			cancel() {
				this.$emit('cancel');
				if(this.onCancel) this.onCancel();
            },
		},
		mounted() {
            document.body.classList.add('modal-open');
		},
		beforeDestroy() {
            document.body.classList.remove('modal-open');
		}
	}
</script>

<style>
	.vue-modal-enter-active, .vue-modal-leave-active {
		transition: opacity 0.2s
	}

	.modal.vue-bs-modal {
		background-color: rgba(0,0,0,0.6);
		display: block;
		overflow-y: scroll;
	}

	.vue-modal-enter {
		opacity: 0;
	}

	.vue-modal-leave-active {
		opacity: 0;
	}

	.vue-bs-modal .modal-header h2,
	.vue-bs-modal .modal-header h3,
	.vue-bs-modal .modal-header h4 {
		margin-bottom: 0;
	}
</style>