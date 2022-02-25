<template>
    <modal
        :title="title"
        :size="size"
        @cancel="$emit('cancel')"
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
                    @click="$emit('delete')"
                    customClass="btn-danger pull-left"
                    icon="trash-o"
                    :buttonText="deleteText"
                    :loading="deleting"
                    :loadingText="deletingText"
                />
                <form-button
                    :buttonText="cancelText"
                    @click="$emit('cancel')"
                />
                <form-button
                    customClass="btn-success"
                    :buttonText="submitText"
                    icon="check"
                    :loading="submitting"
                    :loadingText="submittingText"
                    @click="$refs._form.submit()"
                />
            </slot>
        </div>
    </modal>
</template>


<script lang="ts">
import AdminForm from './AdminForm.vue';
import FormButton from '@/components/forms/FormButton.vue';
import Modal from '../general/Modal.vue';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'AdminFormModal',
    components: {
        AdminForm,
        FormButton,
        Modal
    }
})
export default class AdminFormModal extends Vue {

    $refs!: {
        _form: AdminForm;
    }

    /* Props
	============================================*/

    @Prop({ type: String, required: false, default: 'Cancel' })
    readonly cancelText: string;

    @Prop({ type: String, required: false, default: 'Delete' })
    readonly deleteText: string;

    @Prop({ type: Boolean, required: false })
    readonly deleting: boolean;

    @Prop({ type: String, required: false, default: 'Deleting...' })
    readonly deletingText: string;

    @Prop({ type: Boolean, required: false })
    readonly horizontal: boolean;

    @Prop({ type: String, required: false, default: 'Submit' })
    readonly submitText: string;

    @Prop({ type: Boolean, required: false })
    readonly submitting: boolean;

    @Prop({ type: String, required: false, default: 'Submitting...' })
    readonly submittingText: string;

    @Prop({ type: Boolean, required: false })
    readonly showDeleteButton: boolean;

    @Prop({ type: String, required: false })
    readonly title: string;

    @Prop({ type: String, required: false, default: 'md' })
    readonly size: string;

}

</script>