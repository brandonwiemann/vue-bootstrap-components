<template>
    <transition name="vue-modal">
        <div class="modal vue-bs-modal" role="dialog" @click.self="onClickSelf">
            <div :class="['modal-dialog', 'modal-' + size]">
                <div class="modal-content">
                    <div class="modal-header" v-if="title || $slots.header">
                        <button type="button" class="close" @click="$emit('cancel')">&times;</button>
                        <h4 class="modal-title" v-if="title">{{title}}</h4>
                        <slot name="header"></slot>
                    </div>
                    <div class="modal-body" v-if="showBody">
                        <slot name="body"></slot>
                        <br />
                        <error-message :error="error" />
                    </div>
                    <div class="modal-scroller" v-if="$slots.scroller">
                        <slot name="scroller"></slot>
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


<script lang="ts">
import ErrorMessage from '@/components/general/ErrorMessage.vue';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'Modal',
    components: {
        ErrorMessage
    }
})
export default class Modal extends Vue {

    /* Props
	============================================*/

    @Prop({ type: Boolean, required: false })
    readonly closeOnClickSelf: boolean;

    @Prop({ type: Boolean, required: false, default: true })
    readonly showBody: boolean;

    @Prop({ type: String, required: false, default: '' })
    readonly error: string;

    @Prop({ type: String, required: false, default: '' })
    readonly className: string;

    @Prop({ type: Function, required: false })
    readonly onCancel: () => void;

    @Prop({ type: String, required: false, default: 'md' })
    readonly size: string;

    @Prop({ type: String, required: false, default: '' })
    readonly title: string;

    /* Methods
	============================================*/

    cancel() {
        this.$emit('cancel');
        if (this.onCancel) this.onCancel();
    }

    onClickSelf() {
        if (this.closeOnClickSelf) this.cancel();
    }

    /* Lifecycle Hooks
	============================================*/

    mounted() {
        document.body.classList.add('modal-open');
    }

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