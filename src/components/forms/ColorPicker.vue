<template>
    <form-field-wrapper v-bind="wrapperProps">
       <div class="color-picker" @keydown="handleEnterTab($event)">
           <div class="input-group">
                <span
                    class="input-group-addon color-preview"
                    :style="{'background-color': colorString}"
                    @click="showColorPicker = true"
                >
                    &nbsp;&nbsp;&nbsp;
                </span>
                <input
					type="text"
					class="form-control"
					:id="id"
					:disabled="disabled"
					:readonly="readonly"
					v-model="colorString"
					v-on="inputListeners"
					ref="_input"
				/>
            </div>
            <div class="picker-wrapper" v-if="showColorPicker">
                <chrome-color-picker
                    :value="colorString"
                    @input="updateColor"
                />
           </div>
       </div>
    </form-field-wrapper>
</template>

<script>
import FormField from "./private/FormField.vue";
import { Chrome } from "vue-color";
import validator from '../../helpers/form-validator';
export default {
    extends: { ...FormField },
    name: "ColorPicker",
    components: {
        "chrome-color-picker": Chrome
    },
    computed: {
        inputRules() {
            let userRules = this.rules || "";
            if (userRules.indexOf("colorhex") > -1) return userRules;
            return `${userRules}|colorhex`;
		},
		inputListeners() {
			let self = this;
			return Object.assign({}, self.$listeners, {
				input: function (event) {
					self.updateColor(event.target.value)
				},
				focus() {
					self.showColorPicker = true;
				},
				keyup(event) {
					self.handleKeyPress(event);
				}
			});
		}
    },
    data() {
        return {
            colorString: this.value || '',
            showColorPicker: false
        };
    },
    methods: {
        handleEnterTab($e) {
            if(!this.showColorPicker) return;
            if ($e.keyCode === 27) {
                this.hideColorPicker();
            } else if ($e.keyCode === 13 || $e.keyCode === 9) {
                this.updateColor($e.target.value);
                this.hideColorPicker();
            }
        },

        handleExternalEvents(remove = false) {
            let self = this;
            if (!remove) {
                document.body.addEventListener(
                    "click",
                    self.hideColorPicker.bind(this)
                );
                document.body.addEventListener(
                    "keydown",
                    self.handleEnterTab.bind(this)
                );
            } else {
                document.body.removeEventListener(
                    "click",
                    self.hideColorPicker
                );
                document.body.removeEventListener(
                    "keydown",
                    self.handleEnterTab
                );
            }
        },

        hideColorPicker($e) {
            if ($e) {
                if (this.$el.contains($e.target)) return;
            }
            this.showColorPicker = false;
            if (!this.$refs._input) return;
            this.$refs._input.blur();
        },

        updateColor(color) {
            if (typeof color === 'object' && color.hex) {
                this.colorString = color.hex;
            } else if (typeof color === 'string') {
                this.colorString = color;
            } else {
                this.colorString = '';
            }
            this.$emit("input", this.colorString);
        },

        validate() {
			return new Promise((resolve, reject) => {
				this.error = null;
				if(!this.canValidate) resolve(true);
				this.error = validator.validate(this.inputRules, this.value, this.label);
				resolve(!this.error);
			});
        },

    },
    mounted() {
        this.handleExternalEvents();
    },
    beforeDestroy() {
        this.handleExternalEvents(true);
    },
    watch: {
        value: function(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.updateColor(newVal);
            }
        }
    }
};
</script>

<style scoped>
.color-picker {
    position: relative;
	max-width: 440px;
}
.color-preview {
    cursor: pointer;
}
.picker-wrapper {
    top: 100%;
    position: absolute;
    z-index: 99;
}
</style>