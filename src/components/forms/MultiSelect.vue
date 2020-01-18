<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div class="pm-multi-select">
			<div class="ms-input" @click="listVisible = true">
				<input
					class="form-control"
					type="text"
					v-on="listeners"
					:value="inputText"
				/>
			</div>
            <div class='ms-list' v-show="listVisible" @mouseleave="hideList">
				<div class="ms-help">Hold shift to select multiple values</div>
				<div class="ms-item" @click="selectAll" v-if="availableItems.length && !inputText">{{selectAllText}}</div>
                <div
					v-for="(d, index) in availableItems"
					@click="queueItem(d)"
					:class="['ms-item', {'selected': isQueued(d), 'highlighted': highlighted === index}]"
					:key="d[anchor]"
				>
                    {{ d[labelKey] }}
                </div>
            </div>
			<div class="ms-selected" v-if="!hideSelected">
				<div v-if="allItemsAreSelected" class="ms-selected-item">
					<i @click.stop="removeAllItems()" class="fas fa fa-times"></i>
					{{allItemsLabel}}
				</div>
                <div v-if="!allItemsAreSelected" class="ms-selected-item" :key="s[anchor]" v-for="s in selected">
                    <i @click.stop="removeItem(s)" class="fas fa fa-times"></i>
                    {{ s[labelKey] }}
                </div>
			</div>
        </div>
    </form-field-wrapper>
</template>

<script>
    import FormField from './private/FormField.vue';
	export default {
        extends: { ...FormField },
        name: 'MultiSelect',
        props: {
			allItemsLabel: {
				type: String,
				default: 'All Items'
			},
            value: {
                type: Array,
                required: true,
            },
            data: {
                type: Array,
                required: true,
            },
            anchor: {
                type: String,
                required: true,
			},
			min: Number,
			max: Number,
            labelKey: {
                type: String,
                required: true,
			},
			helpText: {
				type: String,
				default: "Hold shift to select multiple values",
			},
			hideSelected: Boolean,
			selectAllText: {
				type: String,
				default: 'Select All'
			}
		},
		computed: {

			availableItems() {
				if(!this.inputText) return this.unselected;
				let x = [], query = this.inputText.toLowerCase();
				for(let i=0;i<this.unselected.length;i++) {
					let val = this.unselected[i][this.labelKey];
					if(val.toLowerCase().indexOf(query) > -1) {
						x.push(this.unselected[i]);
					}
				}
				return x;
			},

			allItemsAreSelected() {
				if(!this.data || !this.selected) return false;
				return this.data.length === this.selected.length;
			},

			closestMatch() {
				if(!this.inputText || !this.availableItems.length) return '';
				let match = this.availableItems.find(x => x[this.labelKey].substr(0, this.inputText.length) === this.inputText);
				if(!match) return '';
				return match[this.labelKey];
			},

			listeners() {
				let self = this;
				return {
					...self.$listeners,
					input(e) {
						self.inputText = e.target.value;
						self.filterByText(e.target.value);
					},
					focus() {
						self.listVisible = true;
					}
				}
			}

		},
        data() {
            return {
				highlighted: null,
				inputText: '',
				listVisible: false,
				queuedItems: [],
                selected: this.value || [],
				shiftIsPressed: false,
				unselected: this.data
            };
        },
        methods: {

            addItem(item, ignoreQueued = false) {
				if (!ignoreQueued) this.addQueuedItems();
                if (this.isSelected(item)) return;
                this.selected.push(item);
				this.listVisible = false;
				this.$emit("input", this.selected);
			},

			addQueuedItems() {
				this.queuedItems.forEach(x => this.addItem(x, true));
				this.queuedItems = [];
			},

			filterByText(val) {
				this.inputText = val;
				if(val && !this.listVisible) {
					this.listVisible = true;
				}
				if(!this.availableItems || !this.availableItems.length)  {
					this.highlighted = null;
				} else {
					this.highlighted = 0;
				}
			},

			isSelected(item) {
				return this.selected.some(x => x[this.anchor] === item[this.anchor])
			},

            queueItem(item) {
				if (this.shiftIsPressed) {
					if (this.queuedItems.some(x => x[this.anchor] === item[this.anchor])) {
						this.queuedItems = this.queuedItems.filter(x => x[this.anchor] !== item[this.anchor]);
					} else {
						this.queuedItems.push(item);
					}
				} else {
					this.addItem(item);
				}
			},

			updateUnselected() {
				let self = this;
				self.unselected = self.data.filter(x => !self.isSelected(x));
			},

            removeItem(item) {
				this.selected = this.selected.filter(x => x[this.anchor] !== item[this.anchor]);
				this.$emit("input", this.selected);
			},

			removeAllItems() {
				this.selected = [];
				this.$emit("input", this.selected);
			},

			handleArrowPress(up = false) {
				if(up === false && this.highlighted === null) {
					this.highlighted = 0;
				} else {
					let index = this.highlighted;
					index = up ? index - 1 : index + 1;
					if(index >= this.availableItems.length || index < 0) return;
					this.highlighted = index;
				}
			},

			handleEnterPress() {
				if(this.highlighted !== null && this.availableItems[this.highlighted]) {
					this.addItem(this.availableItems[this.highlighted]);
					this.hideList();
				} else {
					this.addQueuedItems();
					this.hideList();
				}
			},

            handleListeners(remove = false) {
                let self = this;
                if(!remove) {
                    document.body.addEventListener('keydown', self.handleKeyDown.bind(this));
                    document.body.addEventListener('keyup', self.handleKeyUp.bind(this));
                } else {
                    document.body.removeEventListener('keydown', self.handleKeyDown);
                    document.body.removeEventListener('keyup', self.handleKeyUp);
                }
			},

            handleKeyDown(e) {
                if(!this.listVisible) return;
                if (e.keyCode === 16) {
					this.shiftIsPressed = true;
				} else if (e.keyCode === 13) {
					this.handleEnterPress();
				} else if(e.keyCode === 27) {
					this.listVisible = false;
					this.highlighted = null;
				} else if(e.keyCode === 38) {
					this.handleArrowPress(true);
				} else if(e.keyCode === 40) {
					this.handleArrowPress(false);
				}
			},

            handleKeyUp(e) {
                if (e.keyCode === 16) this.shiftIsPressed = false;
			},

			isQueued(item) {
				return this.queuedItems.some(x => x[this.anchor] === item[this.anchor]);
			},

			hideList() {
				this.queuedItems = [];
				this.listVisible = false;
				this.highlighted = null;
				this.inputText = '';
			},

			selectAll() {
				this.data.forEach(x => this.addItem(x));
			},

			validate() {
				return new Promise((resolve, reject) => {
					this.error = null;
					if(!this.rules || this.rules === '') resolve(true);
					if(this.isRequired && this.selected.length === 0) {
						this.error = "Please select at least one value.";
					} else if(this.min && this.selected.length < this.min) {
						this.error = `Please select at least ${min} values.`;
					} else if(this.max && this.selected.length > this.max) {
						this.error = `Please select ${max} or fewer values.`;
					}
					resolve(!this.error);
				});
			}

        },
        mounted() {
			this.handleListeners();
			this.updateUnselected();
        },
        beforeDestroy() {
            this.handleListeners(true);
		},
		watch: {
			selected() {
				this.updateUnselected();
			}
		}
	};
</script>

<style lang="less">
.pm-multi-select {
	position: relative;

	.ms-list {
		position: absolute;
		top: 34px; right: 0; left: 0;
		background-color: white;
		max-height: 300px;
		overflow-y: scroll;
		z-index: 2;
		box-shadow: 1px 1px 8px 0 rgba(0,0,0,.2);
	}

	.ms-item {
		padding: 10px;
		cursor: pointer;
		user-select: none;
	}

	.ms-item:hover {
		background-color: #eee;
	}

	.ms-item.selected {
		background-color: #ccc;
	}

	.ms-item.highlighted {
		background-color: #1893fc;
		color: #FFF;
	}

	.ms-selected-item {
		display: inline-block;
		font-size: 12px;
		margin-right: 5px;
		margin-bottom: 5px;
		border: solid 1px #ccc;
		padding: 2px;
		background-color: #eee;
		user-select: none;
	}

	.ms-selected {
		margin-top: 4px;
	}

	.ms-help {
		color: #999999;
		font-size: 12px;
		font-weight: normal;
		padding: 6px 10px;
	}

	.ms-input {
		height: 34px;
	}
}
</style>