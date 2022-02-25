<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div class="autocomplete-wrapper">
            <input
                data-test="input"
                type="text"
                class="autocomplete-input form-control"
                :class="inputClass"
                :id="id"
                :disabled="disabled"
                :readonly="readonly"
                autocomplete="off"
                :value="value"
                v-bind="$attrs"
                v-on="inputListeners"
            />
            <div class="ac-list" v-show="listVisible && results" ref="_list" data-test="list">
                <div
                    v-for="(r, index) in results"
                    :key="r[anchor]"
                    @mousedown="selectResult(r)"
                    :class="['ac-item', {'highlighted': highlighted === index}]"
                    :id="`result${index}`"
                    data-test="list-item"
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

<script lang="ts">
import BaseFormField from '@/components/forms/private/BaseFormField.vue';
import { AnyObject } from '@/types/generic';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { FormInputEvent } from '@/types/forms';
import { sortByQuery } from '@/helpers/sorting.helpers';

@Component({
    name: 'Autocomplete',
})
export default class Autocomplete extends BaseFormField {

    $refs!: {
        _list: HTMLElement;
    }

    /* Props
	============================================*/

    /**
	 * The key of the data object to use as the emitted value
	 */
    @Prop({ type: String, required: true })
    readonly anchor: string;

    /**
	 * Clear the input field when a value is selected
	 */
    @Prop({ type: Boolean, required: false })
    readonly clearOnSelect: boolean;

    /**
	 * An array of objects to search through
	 */
    @Prop({ type: Array, required: false })
    readonly data: AnyObject[];

    /**
	 * Debounce time in ms
	 */
    @Prop({ type: Number, required: false, default: 250 })
    readonly debounce: number;

    /**
	 * [DEPRECATED] The initial input field value
	 */
    @Prop({ type: String, required: false })
    readonly initValue: string;

    /**
	 * The key of the data object to display as the text value
	 */
    @Prop({ type: String, required: false })
    readonly labelKey: string;

    /**
	 * The minimum amount of characters needed to perform a search
	 */
    @Prop({ type: Number, required: false, default: 3 })
    readonly minCharacters: number;

    /**
	 * [DEPRECATED] Function called when a value is selected
	 */
    @Prop({ type: Function, required: false })
    readonly onSelect: (x: any) => void;

    /**
	 * The URL parameter name for the keyword
	 */
    @Prop({ type: String, required: false, default: 'q' })
    readonly queryParam: string;

    /**
	 * The url to send the search request to
	 */
    @Prop({ type: String, required: false })
    readonly url: string;

    /* Data
	============================================*/

    highlighted: number | null = null;
    listVisible: boolean = false;
    results: any[] = [];
    timeout: number = 0;

    /* Computed
	============================================*/

    get inputListeners(): Record<string, Function | Function[]> {
        const self = this;
        return Object.assign({}, self.$listeners, {
            blur() {
                self.hideList();
            },
            input(event: FormInputEvent) {
                self.search(event);
            }
        });
    }

    /* Methods
	============================================*/

    handleArrowPress(up = false) {
        if (up === false && this.highlighted === null) {
            this.highlighted = 0;
        } else {
            let index = this.highlighted || 0;
            index = up ? index - 1 : index + 1;
            if (index >= this.results.length || index < 0) return;
            this.highlighted = index;
        }
        this.scrollToSelectedElement(this.highlighted);
    }

    handleEnterPress() {
        if (this.highlighted !== null && this.results[this.highlighted]) {
            this.selectResult(this.results[this.highlighted]);
        }
    }

    handleKeyDown(e: KeyboardEvent) {
        if (!this.listVisible) return;
        if (e.keyCode === 38) {
            this.handleArrowPress(true);
        } else if (e.keyCode === 40) {
            this.handleArrowPress(false);
        } else if (e.keyCode === 13) {
            this.handleEnterPress();
        } else if (e.keyCode === 27) {
            this.hideList();
        }
    }

    handleListeners(remove = false) {
        const self = this;
        if (!remove) {
            document.body.addEventListener('keydown', self.handleKeyDown.bind(this));
        } else {
            document.body.removeEventListener('keydown', self.handleKeyDown);
        }
    }

    hideList() {
        this.listVisible = false;
        this.$refs._list.scrollTop = 0;
        this.highlighted = null;
    }

    highlightFirstItem() {
        this.highlighted = 0;
    }

    scrollToSelectedElement(index: number | null) {
        if (!index) return;
        const el = document.getElementById(`result${index}`);
        if (!el) return;
        const topPos = el.offsetTop;
        if (topPos >= this.$refs._list.clientHeight - 100) {
            this.$refs._list.scrollTop = el.offsetTop - 100;
        } else {
            this.$refs._list.scrollTop = 0;
        }
    }

    search(e: FormInputEvent) {
        const self = this;
        let query = e.target.value;
        this.$emit('input', query);
        if (self.timeout) clearTimeout(self.timeout);
        self.timeout = setTimeout(() => {
            if (!query || query.length < self.minCharacters) {
                return self.hideList();
            }
            query = query.toLowerCase();
            if (!self.url && Array.isArray(self.data)) {
                self.searchLocal(query);
            } else {
                self.searchExternal(query);
            }
            if (self.results.length) {
                // Highlight first option
                self.highlightFirstItem();
            }
        }, self.debounce);
    }

    searchLocal(query: string) {
        const results: any[] = [];
        const key = this.labelKey ? this.labelKey : this.anchor;
        this.data.forEach(val => {
            if (val[key].toLowerCase().indexOf(query) > -1) {
                results.push(val);
            }
        });
        this.results = results.sort((a, b) => sortByQuery(a[key].toString(), b[key].toString(), query));
        this.listVisible = true;
    }

    searchExternal(query: string) {
        const url = (this.url.indexOf('?') === -1)
            ? `${this.url}?${this.queryParam}=${query}`
            : `${this.url}&${this.queryParam}=${query}`;

        const self = this;
        self.makeRequest(url).then((res: any) => {
            const results = JSON.parse(res) as AnyObject[];
            const key = self.labelKey ? self.labelKey : self.anchor;
            // Sort the results by the most relevant
            self.results = results.sort((a, b) => sortByQuery(a[key].toString(), b[key].toString(), query));
            self.listVisible = true;
        }).catch((xhr) => {
            console.warn('autocomplete failed', xhr);
        });
    }

    selectResult(result: AnyObject) {
        if (typeof this.onSelect === 'function') {
            console.warn('onSelect prop is deprecated. Please listen to \'select\' event instead');
            this.onSelect(result);
        }
        this.$emit('select', result);
        let newVal = this.labelKey ? result[this.labelKey] : result[this.anchor];
        if (this.clearOnSelect === true) newVal = '';
        this.$emit('input', newVal);
        this.hideList();
    }

    makeRequest(url: string): Promise<AnyObject[]> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = () => reject(xhr);
            xhr.send();
        });
    }

    /* Lifecycle Hooks
	============================================*/

    beforeDestroy() {
        this.handleListeners(true);
    }

    mounted() {
        this.handleListeners();
        if (this.initValue) {
            console.warn('initValue prop on <Autocomplete /> is deprecated. Please use v-model directive instead');
            if (this.initValue !== this.value) {
                this.$emit('input', this.initValue);
            }
        }
    }

    /* Watchers
	============================================*/

    @Watch('initValue')
    onInitValueChange(newVal: any, oldVal: any) {
        if (newVal !== oldVal) {
            console.warn('initValue prop on <Autocomplete /> is deprecated. Please use v-model directive instead');
            this.$emit('input', newVal);
        }
    }

}

</script>

<style lang="scss"></style>