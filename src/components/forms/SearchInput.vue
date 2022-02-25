<template>
    <form-field-wrapper v-bind="wrapperProps">
        <div class="input-group">
            <input
                data-test="input"
                class="form-control"
                :value="value"
                :disabled="disabled"
                v-bind="$attrs"
                v-on="inputListeners"
            />
            <div class="input-group-btn">
                <button
                    data-test="clear-input-button"
                    type="button"
                    class="btn btn-default"
                    v-show="!!value"
                    @click="clearInput"
                >
                    <i v-if="!fontAwesome" class="glyphicon glyphicon-remove" aria-hidden="true"></i>
                    <i v-if="fontAwesome" class="fa fas fa-times" aria-hidden="true"></i>
                    <span class="sr-only">Clear</span>
                </button>
                <button
                    data-test="search-button"
                    class="btn btn-default"
                    @click="search"
                >
                    <i v-if="!fontAwesome" class="glyphicon glyphicon-search" aria-hidden="true"></i>
                    <i v-if="fontAwesome" class="fa fas fa-search" aria-hidden="true"></i>
                    <span class="sr-only">Search</span>
                </button>
                <button
                    v-if="enableAdvancedSearch"
                    class="btn btn-default"
                    @click="toggleAdvancedSearch"
                >
                    <span class="caret" aria-hidden="true" title="Advanced search" data-toggle="tooltip"></span>
                    <span class="sr-only">Advanced Search</span>
                </button>
            </div>
        </div>
    </form-field-wrapper>
</template>

<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import { Component, Prop } from 'vue-property-decorator';
import { FormInputEvent } from '../../types/forms';

@Component({
    name: 'SearchInput',
})
export default class SearchInput extends BaseFormField {

    /* Props
	============================================*/

    @Prop({ type: Boolean, required: false })
    readonly fontAwesome: boolean;

    @Prop({ type: Boolean, required: false })
    readonly searchOnInput: boolean;

    @Prop({ type: Boolean, required: false })
    readonly enableAdvancedSearch: boolean;

    /* Data
	============================================*/

    advancedSearch: boolean = false;

    /* Computed
	============================================*/

    get inputListeners(): Record<string, Function | Function[]> {
        const self = this;
        return Object.assign({}, self.$listeners, {
            keydown(event: KeyboardEvent) {
                self.handleEnter(event);
            },
            input(event: FormInputEvent) {
                self.handleInput(event);
            }
        });
    }

    /* Methods
	============================================*/

    clearInput() {
        this.$emit('input', '');
        this.$emit('clearInput');
    }

    toggleAdvancedSearch() {
        this.advancedSearch = !this.advancedSearch;
        this.$emit('toggleAdvancedSearch', this.advancedSearch);
    }

    handleEnter(e: KeyboardEvent) {
        if (e.keyCode !== 13) return;
        this.search();
    }

    handleInput(e: FormInputEvent) {
        this.$emit('input', e.target.value);
        if (this.searchOnInput) this.search();
    }

    search() {
        this.$emit('search', this.value);
    }

}

</script>