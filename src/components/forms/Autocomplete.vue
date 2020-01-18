
<template>
	<form-field-wrapper v-bind="wrapperProps">
		<div class="autocomplete-wrapper">
			<input
				type="text"
				class="autocomplete-input form-control"
				v-bind:class="inputClass"
				v-bind:id="id"
				v-bind:disabled="disabled"
				v-bind:readonly="readonly"
				autocomplete="off"
				:value="value"
				v-bind="$attrs"
				v-on="inputListeners"
			/>
			<div class="ac-list" v-show="listVisible && results" ref="_list">
				<div
					v-for="(r, index) in results"
					:key="r[anchor]"
					@mousedown="selectResult(r)"
					:class="['ac-item', {'highlighted': highlighted === index}]"
					:id="`result${index}`"
				>
					<span>
						<b v-if="!labelKey">{{ r[anchor] }}</b>
						<span v-if="labelKey">{{ r[labelKey] }}</span>
					</span>
				</div>
				<div
					v-if="value && results.length === 0"
					:class="['ac-item']"
				>
					No results found for "{{value}}"
				</div>
			</div>
		</div>
	</form-field-wrapper>
</template>

<script>
import FormField from "./private/FormField.vue";
import { jsonCopy, jsonEquals } from 'helpers/functions';
import { sortByQuery } from '../../helpers/functions';
export default {
    extends: { ...FormField },
    props: {
		anchor: {
			type: String,
			required: true
		},
		clearOnSelect: Boolean,
		data: Array,
		debounce: {
			type: Number,
			default: 250
		},
		initValue: String,
		labelKey: String,
		minCharacters: {
			type: Number,
			default: 3
		},
		onSelect: Function,
		queryParam: {
			type: String,
			default: 'q'
		},
		url: String,
		value: {
			type: String,
			default: ''
		}
	},

	computed: {
		inputListeners() {
			let self = this;
			return Object.assign({}, self.$listeners, {
				blur(event) {
					self.hideList();
				},
				input(event) {
					self.search(event);
				}
			});
		}
	},
    data() {
        return {
			highlighted: null,
			listVisible: false,
			results: [],
			timeout: null
        };
    },

    methods: {

		handleArrowPress(up = false) {
			if(up === false && this.highlighted === null) {
				this.highlighted = 0;
			} else {
				let index = this.highlighted;
				index = up ? index - 1 : index + 1;
				if(index >= this.results.length || index < 0) return;
				this.highlighted = index;
			}
			this.scrollToSelectedElement(this.highlighted);
		},

		handleEnterPress() {
			if(this.highlighted !== null && this.results[this.highlighted]) {
				this.selectResult(this.results[this.highlighted]);
			}
		},

		handleKeyDown(e) {
			if(!this.listVisible) return;
			if(e.keyCode === 38) {
				this.handleArrowPress(true);
			} else if(e.keyCode === 40) {
				this.handleArrowPress(false);
			} else if (e.keyCode === 13) {
				this.handleEnterPress();
			} else if(e.keyCode === 27) {
				this.hideList();
			}
		},

		handleListeners(remove = false) {
			let self = this;
			if(!remove) {
				document.body.addEventListener('keydown', self.handleKeyDown.bind(this));
			} else {
				document.body.removeEventListener('keydown', self.handleKeyDown);
			}
		},

		hideList() {
			this.listVisible = false;
			this.$refs._list.scrollTop = 0;
			this.highlighted = null;
		},

		highlightFirstItem() {
			this.highlighted = 0;
		},

		scrollToSelectedElement(index) {
			if(!index) return;
			let el = document.getElementById(`result${index}`);
			if(!el) return;
			let topPos = el.offsetTop;
			if(topPos >= this.$refs._list.clientHeight - 100) {
				this.$refs._list.scrollTop = el.offsetTop - 100;
			} else {
				this.$refs._list.scrollTop = 0;
			}
		},

		search(e) {
			let self = this;
			let query = e.target.value;
			this.$emit('input', query);
			if(self.timeout) clearTimeout(self.timeout);
			self.timeout = setTimeout(() => {
				if(!query || query.length < self.minCharacters) {
					return self.hideList();
				}
				query = query.toLowerCase();
				if(!self.url && Array.isArray(self.data)) {
					self.searchLocal(query);
				} else {
					self.searchExternal(query);
				}
				if(self.results.length) {
					// Highlight first option
					self.highlightFirstItem();
				}
			}, self.debounce);
		},

		searchLocal(query) {
			let self = this;
			let results = [];
			let key = !!this.labelKey ? this.labelKey : this.anchor;
			this.data.forEach(val => {
				if(val[key].toLowerCase().indexOf(query) > -1) {
					results.push(val);
				}
			});
			self.results = results.sort((a, b) => sortByQuery(a[key].toString(), b[key].toString(), query));
			self.listVisible = true;
		},

		searchExternal(query) {
			let self = this;
			let url = `${self.url}?${self.queryParam}=${query}`;
			self.makeRequest(url).then((res) => {
				let results = JSON.parse(res);
				let key = !!self.labelKey ? self.labelKey : self.anchor;
				// Sort the results by the most relevant
				self.results = results.sort((a, b) => sortByQuery(a[key].toString(), b[key].toString(), query));
				self.listVisible = true;
			}).catch((xhr) => {
				console.warn('autocomplete failed', xhr);
			});
		},

		selectResult(result) {
			if(typeof this.onSelect === 'function') {
				console.warn("onSelect prop is deprecated. Please listen for a 'select' event instead");
				this.onSelect(result);
			}
			this.$emit('select', result);
			let newVal = this.labelKey ? result[this.labelKey] : result[this.anchor];
			if(this.clearOnSelect === true) newVal = '';
			this.$emit('input', newVal);
			this.hideList();
		},

		makeRequest(url) {
			return new Promise((resolve, reject) => {
				let xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.onload = () => resolve(xhr.response);
				xhr.onerror = () => reject(xhr);
				xhr.send();
			});
		}
	},
	beforeDestroy() {
		this.handleListeners(true);
	},
	mounted() {
		this.handleListeners();
		if(!!this.initValue) {
			console.warn('initValue prop on <Autocomplete /> is deprecated. Please use v-model directive instead');
			if(this.initValue !== this.value) {
				this.$emit('input', this.initValue);
			}
		}
	},
	watch: {
		initValue(newVal, oldVal) {
			if(newVal !== oldVal) {
				this.$emit('input', newVal);
			}
		}
	}
};
</script>

<style lang="less">
.autocomplete-wrapper {
	position: relative;
}
.ac-list {
	position: absolute;
	top: 34px; right: 0; left: 0;
	background-color: white;
	max-height: 300px;
	overflow-y: scroll;
	z-index: 2;
	box-shadow: 1px 1px 8px 0 rgba(0,0,0,.2);
}

.ac-item {
	padding: 10px;
	cursor: pointer;
	user-select: none;
}

.ac-item:hover {
	background-color: #eee;
}

.ac-item.selected {
	background-color: #ccc;
}

.ac-item.highlighted {
	background-color: #1893fc;
	color: #FFF;
}
</style>