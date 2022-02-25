<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div class="pm-multi-select" @focusout="handleFocusOut">
            <div class="ms-input" @click="listVisible = true">
                <input
                    data-test="input"
                    class="form-control"
                    type="text"
                    v-on="listeners"
                    v-model="inputText"
                />
            </div>
            <div class='ms-list' v-show="listVisible" @mouseleave="hideList">
                <div class="ms-help">Hold shift to select multiple values</div>
                <div
                    v-if="availableItems.length && !inputText && allowSelectAll"
                    class="ms-item ms-select-all"
                    @click="selectAll"
                    tabindex="-1"
                >
                    {{selectAllText}}
                </div>
                <div
                    v-for="(d, index) in availableItems"
                    tabindex="-1"
                    @click="queueItem(d)"
                    :class="['ms-item', {'selected': isQueued(d), 'highlighted': highlighted === index}]"
                    :key="d[anchor]"
                >
                    {{ d[labelKey] }}
                </div>
            </div>
            <template v-if="!hideSelected">
                <div v-if="allItemsAreSelected" class="ms-selected">
                    <div @click.stop="removeAllItems()" class="ms-selected-item">
                        <i class="fas fa fa-times"></i>
                        {{allItemsLabel}}
                    </div>
                </div>
                <div v-else class="ms-selected">
                    <div @click.stop="removeItem(s)" class="ms-selected-item" :key="s[anchor]" v-for="s in selected">
                        <i class="fas fa fa-times"></i>
                        {{ s[labelKey] }}
                    </div>
                </div>
            </template>
        </div>
    </form-field-wrapper>
</template>

<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import { AnyObject } from '../../types/generic';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { jsonEquals } from '@/helpers/json.helpers';

@Component({
    name: 'MultiSelect',
})
export default class MultiSelect extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: String, required: false, default: 'All Items' })
    readonly allItemsLabel: string;

    @Prop({ type: Boolean, required: false, default: true })
    readonly allowSelectAll: boolean;

    @Prop({ type: String, required: true })
    readonly anchor: string;

    @Prop({ type: Array, required: false })
    readonly data: AnyObject[];

    @Prop({ type: String, required: false, default: 'Hold shift to select multiple values' })
    readonly helpText: string;

    @Prop({ type: Boolean, required: false })
    readonly hideSelected: boolean;

    @Prop({ type: String, required: true })
    readonly labelKey: string;

    @Prop({ type: Number, required: false })
    readonly max: number;

    @Prop({ type: Number, required: false })
    readonly min: number;

    @Prop({ type: String, required: false, default: 'Select All' })
    readonly selectAllText: string;

    @Prop({ type: Array, required: true })
    readonly value: AnyObject[];

    /* Data
	============================================*/

    highlighted: number | null = null;
    inputText: string = '';
    listVisible: boolean = false;
    queuedItems: AnyObject[] = [];
    selected: AnyObject[] = this.value || [];
    shiftIsPressed: boolean = false;

    /* Computed
	============================================*/

    get availableItems() {
        if (!this.searchQuery) return this.unselected;
        return this.unselected.filter(item => {
            const value = item[this.labelKey].toLowerCase();
            return value.indexOf(this.searchQuery) > -1;
        });
    }

    get unselected() {
        return this.data.filter(x => !this.isSelected(x));
    }

    get searchQuery() {
        return this.inputText.trim().toLowerCase();
    }

    get allItemsAreSelected() {
        if (!this.data || !this.selected) return false;
        return this.data.length === this.selected.length;
    }

    get listeners() {
        const self = this;
        return {
            ...self.$listeners,
            input() {
                return null;
            },
            focus() {
                self.listVisible = true;
            },
        };
    }

    /* Methods
	============================================*/

    addItem(item: AnyObject, ignoreQueued = false) {
        if (!ignoreQueued) this.addQueuedItems();
        if (this.isSelected(item)) return;
        this.selected = [...this.selected, item];
        this.listVisible = false;
        this.$emit('input', this.selected);
    }

    addQueuedItems() {
        this.queuedItems.forEach(x => this.addItem(x, true));
        this.queuedItems = [];
    }

    isSelected(item: AnyObject) {
        return this.selected.some(x => x[this.anchor] === item[this.anchor]);
    }

    queueItem(item: AnyObject) {
        if (this.shiftIsPressed) {
            if (this.queuedItems.some(x => x[this.anchor] === item[this.anchor])) {
                this.queuedItems = this.queuedItems.filter(x => x[this.anchor] !== item[this.anchor]);
            } else {
                this.queuedItems.push(item);
            }
        } else {
            this.addItem(item);
        }
    }

    removeItem(item: AnyObject) {
        this.selected = this.selected.filter(x => x[this.anchor] !== item[this.anchor]);
        this.$emit('input', this.selected);
    }

    removeAllItems() {
        this.selected = [];
        this.$emit('input', this.selected);
    }

    handleArrowPress(up = false) {
        if (up === false && this.highlighted === null) {
            this.highlighted = 0;
        } else {
            let index = this.highlighted || 0;
            index = up ? index - 1 : index + 1;
            if (index >= this.availableItems.length || index < 0) return;
            this.highlighted = index;
        }
    }

    handleEnterPress() {
        if (this.highlighted !== null && this.availableItems[this.highlighted]) {
            this.addItem(this.availableItems[this.highlighted]);
        } else {
            this.addQueuedItems();
        }

        this.hideList();
    }

    handleListeners(remove = false) {
        const self = this;
        if (!remove) {
            document.body.addEventListener('keydown', self.handleKeyDown);
            document.body.addEventListener('keyup', self.handleKeyUp);
        } else {
            document.body.removeEventListener('keydown', self.handleKeyDown);
            document.body.removeEventListener('keyup', self.handleKeyUp);
        }
    }

    handleKeyDown(e: KeyboardEvent) {
        if (!this.listVisible) return;
        if (e.keyCode === 16) {
            this.shiftIsPressed = true;
        } else if (e.keyCode === 13) {
            this.handleEnterPress();
        } else if (e.keyCode === 27) {
            this.listVisible = false;
            this.highlighted = null;
        } else if (e.keyCode === 38) {
            this.handleArrowPress(true);
        } else if (e.keyCode === 40) {
            this.handleArrowPress(false);
        }
    }

    handleKeyUp(e: KeyboardEvent) {
        if (e.keyCode === 16) this.shiftIsPressed = false;
    }

    handleFocusOut(e: FocusEvent) {
        if (!this.$el.contains(e.relatedTarget as HTMLElement)) {
            this.hideList();
        }
    }

    isQueued(item: AnyObject) {
        return this.queuedItems.some(x => x[this.anchor] === item[this.anchor]);
    }

    hideList() {
        this.queuedItems = [];
        this.listVisible = false;
        this.highlighted = null;
        this.inputText = '';
    }

    selectAll() {
        this.data.forEach(x => this.addItem(x));
    }

    validate(): Promise<boolean> {
        return new Promise((resolve) => {
            this.error = null;
            if (!this.rules || this.rules === '') resolve(true);
            if (this.isRequired && this.selected.length === 0) {
                this.error = 'Please select at least one value.';
            } else if (this.min && this.selected.length < this.min) {
                this.error = `Please select at least ${this.min} values.`;
            } else if (this.max && this.selected.length > this.max) {
                this.error = `Please select ${this.max} or fewer values.`;
            }
            resolve(!this.error);
        });
    }

    /* Lifecycle Hooks
	============================================*/

    mounted() {
        this.handleListeners();
    }

    beforeDestroy() {
        this.handleListeners(true);
    }

    /* Watchers
	============================================*/

    @Watch('value')
    onValueChange(newVal: any, prevVal: any) {
        if (!jsonEquals(newVal, prevVal)) this.selected = this.value;
    }

    @Watch('searchQuery')
    onSearchQueryChange(query: any) {
        if (query) {
            this.listVisible = true;
        }
        if (!this.availableItems || !this.availableItems.length)  {
            this.highlighted = null;
        } else {
            this.highlighted = 0;
        }
    }

}

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