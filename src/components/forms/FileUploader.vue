<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div class="file-uploader">
            <div class="file-uploader-area">
                <form class="box" method="post" action="" enctype="multipart/form-data">
                    <div class="box-input">
                        <input
                            class="input-file"
                            type="file"
                            name="files[]"
                            :id="id"
                            :accept="fileType"
                            @change="changeFile"
                        />
                        <label :for="id">
                            <form-button
                                :loading="uploading"
                                loadingText="Uploading..."
                                :buttonText="buttonLabel"
                                customClass="btn-primary"
                                icon="upload"
                            />
                        </label>
                        <div class="file-name">{{fileName}}</div>
                    </div>
                </form>
            </div>
        </div>
    </form-field-wrapper>
</template>

<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import FormButton from './FormButton.vue';
import { Component, Prop } from 'vue-property-decorator';
import { FormInputEvent } from '../../types/forms';

@Component({
    name: 'FileUploader',
    components: {
        FormButton
    }
})
export default class FileUploader extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: String, required: false, default: 'Upload File' })
    readonly buttonText: string;

    @Prop({ type: Number, required: false })
    readonly maxKb: number;

    @Prop({ type: String, required: false })
    readonly fileType: string;

    @Prop({ type: String, required: true })
    readonly value: string;

    /* Data
	============================================*/

    error: string | null = null;
    fileName?: string | null = this.value?.split('/').pop() ?? null;
    uploading: boolean = false;

    /* Computed
	============================================*/

    get buttonLabel(): string {
        if (this.buttonText !== 'Upload File') return this.buttonText;
        if (this.fileName) return 'Upload New File';
        return 'Upload File';
    }

    /* Methods
	============================================*/

    changeFile(event: FormInputEvent) {
        if (!event?.target?.files) return;
        const file = (event?.target?.files || [null])[0];
        if (!file?.name) return;
        this.fileName = file.name;
        this.$emit('fileAdded', file);
    }

    validate(): Promise<boolean> {
        return new Promise((resolve) => {
            this.error = null;
            if (!this.rules) resolve(true);
            if (this.isRequired && !this.fileName) {
                this.error = 'Required';
            }
            resolve(!this.error);
        });
    }

}

</script>

<style scoped>
	.input-file {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}
	.input-file + label {
		cursor: pointer;
		font-size: 1.25em;
		font-weight: normal;
		color: #666;
		font-size: 14px;
		display: inline-block;
		width: 100%;
	}
</style>