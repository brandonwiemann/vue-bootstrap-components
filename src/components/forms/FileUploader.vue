<template>
	<form-field-wrapper v-bind="wrapperProps">
		<div class="file-uploader">
			<div class="file-uploader-area">
				<form class="box" method="post" action="" enctype="multipart/form-data">
					<div class="box-input">
						<input class="input-file" type="file" name="files[]" :id="id" :accept="fileType" v-on:change="changeFile" />
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

<script>
import FormButton from './FormButton.vue';
import FormField from './private/FormField.vue';
import FormFieldWrapper from './private/FormFieldWrapper.vue';

export default {
	extends: { ...FormField },
	name: 'FileUploader',
	components: {
		FormButton,
		FormFieldWrapper
	},
	props: {
		buttonText: {
			default: 'Upload File',
			type: String
		},
		maxKb: Number,
		fileType: String
	},
	computed: {
		buttonLabel() {
			if(this.buttonText !== 'Upload File') return this.buttonText;
			if(this.fileName) return 'Upload New File';
			return 'Upload File';
		}
	},
	data() {
		return {
			error: null,
			fileName: this.value ? this.value.split('/').pop() : null,
			uploading: false
		}
    },
	methods: {
		changeFile(event) {
			if(!event) return;
			let file = event.target.files[0];
			if(!file || !file.name) return;
			this.fileName = file.name;
			this.$emit('fileAdded', file);
		},

        validate() {
			return new Promise((resolve, reject) => {
				this.error = null;
				if(!this.rules) resolve(true);
				if(this.isRequired && !this.fileName) {
					this.error = "Required";
				}
				resolve(!this.error);
			});
        }
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