<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div class="pm-checkbox-select" @focusout="handleFocusOut">
            <div class="cs-input" @click="listVisible = true">
                <input
                    data-test="input"
                    class="form-control"
                    type="text"
                    v-on="listeners"
                    v-model="inputText"
                />
            </div>
            <div class='cs-list' v-show="listVisible" @mouseleave="hideList">
                <div class="cs-help">Hold shift to select multiple values</div>
                <div
                    v-if="availableItems.length && !inputText && allowSelectAll"
                    class="cs-item cs-select-all"
                    @click="selectAll"
                    tabindex="-1"
                >
                    {{selectAllText}}
                </div>
                <div
                    v-for="(d, index) in availableItems"
                    tabindex="-1"
                    @click="queueItem(d)"
                    :class="['cs-item', {'selected': isQueued(d), 'highlighted': highlighted === index}]"
                    :key="d[anchor]"
                >
                    {{ d[labelKey] }}
                </div>
            </div>
            <template v-if="!hideSelected">
                <div v-if="allItemsAreSelected" class="cs-selected">
                    <div @click.stop="removeAllItems()" class="cs-selected-item">
                        <i class="fas fa fa-times"></i>
                        {{allItemsLabel}}
                    </div>
                </div>
                <div v-else class="cs-selected">
                    <div @click.stop="removeItem(s)" class="cs-selected-item" :key="s[anchor]" v-for="s in selected">
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
    name: 'CheckboxSelect',
})
export default class CheckboxSelect extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: String, required: false })
    readonly anchor: string;

    @Prop({ type: Array, required: false })
    readonly data: AnyObject[] | string[];

    @Prop({ type: String, required: false, default: '' })
    readonly helpText: string;

    @Prop({ type: String, required: false })
    readonly labelKey: string;

    @Prop({ type: String, required: false, default: 'Select All' })
    readonly selectAllText: string;

    @Prop({ type: Array, required: true })
    readonly value: AnyObject[] | string[];

    /* Data
	============================================*/

    inputText: string = '';
    listVisible: boolean = false;
    selected: AnyObject[] | string[] = this.value || [];

    /* Computed
	============================================*/

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


}

</script>

<style lang="less">
.pm-checkbox-select {
	position: relative;

	.cs-list {
		position: absolute;
		top: 34px; right: 0; left: 0;
		background-color: white;
		max-height: 300px;
		overflow-y: scroll;
		z-index: 2;
		box-shadow: 1px 1px 8px 0 rgba(0,0,0,.2);
	}

	.cs-item {
		padding: 10px;
		cursor: pointer;
		user-select: none;
	}

	.cs-item:hover {
		background-color: #eee;
	}

	.cs-item.selected {
		background-color: #ccc;
	}

	.cs-item.highlighted {
		background-color: #1893fc;
		color: #FFF;
	}

	.cs-selected-item {
		display: inline-block;
		font-size: 12px;
		margin-right: 5px;
		margin-bottom: 5px;
		border: solid 1px #ccc;
		padding: 2px;
		background-color: #eee;
		user-select: none;
	}

	.cs-selected {
		margin-top: 4px;
	}

	.cs-help {
		color: #999999;
		font-size: 12px;
		font-weight: normal;
		padding: 6px 10px;
	}

	.cs-input {
		height: 34px;
	}
}
</style>