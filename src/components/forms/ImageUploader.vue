<template>
	<form-field-wrapper v-bind="wrapperProps">
		<div class="image-uploader">
			<div class="image-uploader-area">
				<form
					class="box"
					method="post"
					action=""
					enctype="multipart/form-data"
					ref="_form">
					<div class="box-input">
						<input
							ref="_input"
							class="input-file"
							type="file"
							name="files[]"
							:id="id"
							accept="image"
							@change="changeImage" />
						<label :for="id" v-if="!showImage">
							<form-button
								:loading="uploading"
								:disabled="uploading"
								loadingText="Uploading..."
								buttonText="Upload Image"
								class="btn-primary"
								icon="upload"
							/>
						</label>
						<label :for="id" v-show="showImage">
							<div class="img-wrapper">
								<img :src="value" class="preview-img" />
								<div class="img-uploading" v-show="uploading">
									<div><i class="fa fas fa-gear fa-cog fa-spin"></i> Uploading...</div>
								</div>
							</div>
							<div class="img-tips">
								<div class="upload-img">Click thumbnail to change image</div>
								<div class="remove-img" @click.stop.prevent="removeImage">
									<span>&times;</span> Remove Image
								</div>
							</div>
						</label>
					</div>
				</form>
				<error-message :error="error" />
			</div>
		</div>
		<ImageCompressorModal
			v-if="showCompressor"
			:value="tempImage"
			@save="saveCompressedImage"
			@cancel="cancelCompressor"
			:maxKB="options.maxKB"
			:horizontal="horizontal"
		/>
	</form-field-wrapper>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import BaseFormField from './private/BaseFormField.vue';
import imgHelper from '@/classes/ImageHelper';
import ErrorMessage from '@/components/general/ErrorMessage.vue';
import FormButton from '@/components/forms/FormButton.vue';
import ImageCompressorModal from '../general/ImageCompressorModal.vue';
import { IImageUploadRules, FormInputEvent, IImageUploadInfo } from '@/types/forms';
import { AnyObject } from '../../types/generic';

const defaultRules: IImageUploadRules = {
	exactHeight: null,
	exactWidth: null,
	landscapeOnly: false,
	maxHeight: null,
	maxKB: null,
	maxWidth: null,
	maxSize: null,
	portraitOnly: false,
	square: false
};

@Component({
	name: 'ImageUploader',
	components: {
		ErrorMessage,
		FormButton,
		ImageCompressorModal
	}
})
export default class ImageUploader extends BaseFormField {

	$refs!: {
		_form: HTMLFormElement;
		_input: HTMLInputElement;
	}

	/* Props
	============================================*/

	@Prop({type: [Boolean, Function], required: false})
	readonly compress: boolean | ((val?: any) => boolean);

	@Prop({type: Function, required: false})
	readonly onUploadError: (x: string) => any;

	@Prop({
		type: Object as () => IImageUploadRules,
		required: false,
		default() {
			return {};
		}
	})
	readonly options: Partial<IImageUploadRules>;

	@Prop({type: String, required: false, default: ''})
	readonly url: string;

	@Prop({type: String, required: false, default: ''})
	readonly value: string;

	@Prop({type: Function, required: false})
	readonly bypassCompression: (val?: any) => boolean;

	/* Data
	============================================*/

	error: string | null = null;
	fileName: string | null = null;
	imageInfo: AnyObject = {};
	imageSize: number | null = null;
	tempImage: any = null;
	uploading: boolean = false;
	showCompressor: boolean = false

	/* Computed
	============================================*/

	get showImage(): boolean {
		return !!this.value && !this.error;
	}

	/* Methods
	============================================*/

	cancelCompressor() {
		this.error = null;
		this.imageInfo = {},
		this.imageSize = null;
		this.tempImage = null;
		this.uploading = false;
		this.$refs._form.reset();
		this.showCompressor = false;
	}

	changeImage(event: FormInputEvent) {
		if(!event.target?.files) return;
		let self = this;
		self.error = null;
		try {
			let file = event.target.files[0];
			if(!file) return;
			imgHelper.getImageFromFileUpload(file).then((src) => {
				self.updateImage((src as string), file);
			});
		} catch(e) {
			console.warn('Image upload error', e);
			self.error = 'Something went wrong, please try again';
		}
	}

	emitImageUpdates() {
		let self = this;
		if(typeof self.url === 'string' && self.url.length) {
			self.uploadImage().then((res) => {
				res = res.replace(/"/g, '');
				self.imageInfo.src = res;
				self.$emit('input', res);
				self.$emit('change', self.imageInfo);
			}).catch((xhr) => {
				if(typeof self.onUploadError === 'function') {
					self.onUploadError(xhr.statusText);
				} else {
					self.error = 'Upload failed. Please try again';
				}
			});
		} else {
			self.$emit('input', self.imageInfo.src);
			self.$emit('change', self.imageInfo);
		}
	}

	removeImage() {
		this.error = null;
		this.$emit('input',  null);
		this.imageInfo = {};
		this.imageSize = null;
		this.tempImage = null;
		this.$refs._form.reset();
	}

	saveCompressedImage(source: string) {
		this.updateImage(source, null, true);
		this.showCompressor = false;
	}

	updateImage(
		source: string,
		file: Blob | File | null = null,
		suppressCompression: boolean = false
	): void {
		let self = this;
		imgHelper.getImageData(source).then((image) => {
			if(file === null) {
				file = imgHelper.dataURItoBlob(source);
			} else {
				self.fileName = (file as File).name;
			}
			self.imageSize = file.size/1024;
			let imageInfo: IImageUploadInfo = {
				file: file,
				image: image,
				size: self.imageSize,
				src: source,
				name: self.fileName
			};
			if(self.validateImage(imageInfo)) {
				self.imageInfo = imageInfo;
				if (file && file.type && file.type.indexOf('/') > -1) {
					self.imageInfo.extension = file.type.split('/')[1];
				}
				if(self.compress && !suppressCompression) {
					if (typeof self.compress === 'function') {
						if (self.compress(self.imageInfo) === false) {
							self.emitImageUpdates();
							return;
						}
					}
					self.tempImage = source;
					self.showCompressor = true;
				} else {
					self.emitImageUpdates();
				}
			}
		}).catch((e) => {
			console.warn('Image update error', e);
		});
	}

	uploadImage(): Promise<string> {
		let self = this;
		return new Promise((resolve, reject) => {
			if(!self.url) return reject('A valid URL prop is required to upload');
			self.uploading = true;
			self.error = null;
			let data = new FormData();
			data.append('file', self.imageInfo.file, self.imageInfo.name);
			let xhr = new XMLHttpRequest();
			xhr.open('POST', self.url);
			xhr.onload = () => {
				self.uploading = false;
				resolve(xhr.response);
			};
			xhr.onerror = () => {
				self.uploading = false;
				reject(xhr);
			};
			xhr.send(data);
		});
	}

	validateImage(imageInfo: IImageUploadInfo) {
		let image = imageInfo.image;
		let {
			exactHeight,
			exactWidth,
			landscapeOnly,
			maxHeight,
			maxKB,
			maxWidth,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			maxSize,
			portraitOnly,
			square
		} = Object.assign({}, defaultRules, this.options);
		let { height, width } = image;
		this.error = null;

		if(maxKB && (this.imageSize ?? 0) > maxKB) {
			if (typeof this.compress === 'function') {
				if (!this.compress(imageInfo)) {
					this.error = `Image file cannot exceed ${maxKB}kb in size`;
				}
			} else if (!this.compress) {
				this.error = `Image file cannot exceed ${maxKB}kb in size`;
			}
		}

		else if(exactHeight && exactWidth) {
			if(height != exactHeight && width != exactWidth) {
				this.error = `Image must be exactly ${exactWidth}px X ${exactHeight}px`;
			}
		}

		else if(exactHeight && height != exactHeight) {
			this.error = `Image height must be exactly ${exactHeight}px`;
		}

		else if(exactWidth && width != exactWidth) {
			this.error = `Image width must be exactly ${exactWidth}px`;
		}

		else if(maxHeight && height > maxHeight) {
			this.error = `Image height cannot exceed ${maxHeight}px`;
		}

		else if(maxWidth && width > maxWidth) {
			this.error = `Image width cannot exceed ${maxWidth}px`;
		}

		else if(portraitOnly && width > height) {
			this.error = 'Image must be taller than it is wide (portrait)';
		}

		else if(landscapeOnly && height > width) {
			this.error = 'Image must be wider than it is tall (landscape)';
		}

		else if(square && height !== width) {
			this.error = 'Image must be exactly as wide as it is tall';
		}

		return !this.error;
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
	.img-wrapper {
		border: solid 1px #ccc;
		padding: 5px;
        position: relative;
		margin-bottom: 3px;
	}
	.preview-img {
		display: block;
		margin: 0 auto;
		max-height: 200px;
		max-width: 100%;
	}
	.upload-error {
		background-color: #fff2f2;
		border: solid 1px #d40904;
		font-size: 16px;
		padding: 8px;
		color: #d40904;
		margin-bottom: 15px;
	}
	.img-tips {
		align-items: center;
		display: flex;
		justify-content: space-between;
	}
	.remove-img {
		font-weight: bold;
		text-decoration: underline;
	}
	.remove-img span {
		font-size: 125%;
	}
</style>