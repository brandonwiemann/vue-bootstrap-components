<template>
	<modal size="lg" title="Adjust Image Size & Quality" @cancel="$emit('cancel')">
		<div slot="body">
			<p>Use slider to adjust image size and quality. Aim for the lowest possible size, while still maintaining the overall quality of the image.</p>
			<div class="image-compressor">
				<div class="image-compressor-canvas">
					<canvas ref="_canvas"></canvas>
				</div>
				<slider
					label="Quality"
					:helpText="compressAmount + '%'"
					v-model="compressAmount"
					v-on:input="compressImage" :min="1" :max="100" :lazy="true"
				/>
				<div style="margin-bottom: 5px">
					Original Size: {{oldSize}}kb<br/>
					Compressed Size:
					<span :class="['compressed-size', getCompressionRating()]">{{newSize}}kb</span>
					<br/><br/>
				</div>
				<img :src="compressedImage" />
			</div>
			<div v-if="error" style="margin-top: 20px"></div>
			<error-message :error="error" />
		</div>
		<div slot="footer">
			<div slot="footer">
				<form-button
					buttonText="Cancel"
					v-on:click="cancel"
				/>
				<form-button
					customClass="btn-success"
					buttonText="Save"
					icon="check"
					v-on:click="save"
				/>
			</div>
		</div>
	</modal>
</template>

<script>
import ErrorMessage from '../general/ErrorMessage.vue';
import Modal from '../general/Modal.vue';
import Slider from '../forms/Slider.vue';
import imgHelper from '../../helpers/image-helper';
export default {
	name: 'ImageCompressorModal',
	props: {
		value: {
			type: String,
			required: true
		},
		maxKB: {
			type: Number
		}
	},
	components: {
		ErrorMessage,
		Modal,
		Slider
	},
	data() {
		return {
			compressAmount: 75,
			compressedImage: null,
			error: null,
			initialValue: null,
			oldSize: 0,
			newSize: 0
		}
	},
	methods: {
		cancel() {
			this.$emit('cancel');
		},
		compressImage() {
            this.compressedImage = this.$refs._canvas.toDataURL('image/jpeg', this.compressAmount / 100);
			this.newSize = Math.round(imgHelper.dataURItoBlob(this.compressedImage).size/1024);
        },
		getCompressionRating() {
			if(this.maxKB && this.newSize >= this.maxKB) return 'poor';
			if(this.oldSize <= this.newSize) return 'poor';
			if(this.compressAmount > 89) return 'poor';
			if(this.compressAmount < 80) return 'good';
			return 'okay';
		},
        updateCanvas(image) {
            this.$refs._canvas.width = image.width;
            this.$refs._canvas.height = image.height;
            this.$refs._canvas.getContext("2d").drawImage(image, 0, 0);
			this.oldSize = Math.round(imgHelper.dataURItoBlob(this.value).size/1024);
			this.compressImage();
        },
		save() {
			this.error = null;
			if(this.maxKB && this.newSize >= this.maxKB) {
				this.error = `Image must be less than ${this.maxKB}kb`;
				return;
			}
			this.$emit('save', this.compressedImage);
			this.$emit('cancel');
		}
	},
	mounted() {
        let self = this;
        if(self.value) {
			self.initialValue = self.value;
            let img = new Image();
            img.onload = () => {
                self.updateCanvas(img);
            }
			img.src = self.value;
        }
    }
}
</script>

<style scoped>
	.image-compressor canvas {
		display: block;
        width: 0px;
		height: 0px;
    }
	.image-compressor img {
		display: block;
		margin: 0 auto;
        max-width: 100%;
    }
    .compressed-size {
        margin-bottom: 5px;
        padding: 3px;
    }
    .compressed-size.good {
        background-color: #b4f58e;
    }
    .compressed-size.okay {
        background-color: #ffe28b;
    }
    .compressed-size.poor {
        background-color: #fb9e9e;
    }
    .image-compressor .form-group {
        margin: 0 0 15px !important;
    }
</style>