<template>
    <div class="sortable-table table-responsive">
        <table :class="tableClass">
            <thead>
                <tr>
                    <th
                        :class="['st-header', {'st-sorted': header.isSorted}]"
                        v-for="header in headers"
                        :key="header.propertyName"
                        @click="sort(header)"
                    >
                        <span>{{header.label}}</span>
                        <span class="st-arrow invisible" v-if="!header.isSorted">&#x25B2;</span>
                        <span class="st-arrow" v-if="header.isSorted && header.descending">&#x25B2;</span>
                        <span class="st-arrow" v-if="header.isSorted && !header.descending">&#x25BC;</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class="st-row"
                    v-for="(item, index) in sortedData"
                    :key="index"
                    @click="$emit('rowClicked', item)"
                >
                    <td
                        v-for="prop in displayableProperties"
                        :key="prop"
                        :class="{'st-row-sorted': activeSort === prop}"
                    >
                        {{item[prop]}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import SortableHeader from '../../classes/SortableHeader';
import Vue from 'vue';
import { AnyObject } from '@/types/generic';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { dynamicSort } from '@/helpers/sorting.helpers';

@Component({
    name: 'SortableTable',
})
export default class SortableTable extends Vue {

    /* Props
	============================================*/

    @Prop({ type: Boolean, required: false })
    readonly bordered: boolean;

    @Prop({ type: Boolean, required: false })
    readonly condensed: boolean;

    @Prop({ type: Array, required: false })
    readonly columns: string[];

    @Prop({ type: Array, required: true })
    readonly data: AnyObject[];

    @Prop({ type: Boolean, required: false, default: true })
    readonly hover: boolean;

    @Prop({ type: Boolean, required: false })
    readonly sortDisabled: boolean;

    @Prop({ type: Object, required: false })
    readonly sortRule: AnyObject;

    @Prop({ type: Boolean, required: false, default: true })
    readonly striped: boolean;

    /* Data
	============================================*/

    activeSort: string = '';
    headers: any[] = [];
    sortedData: any[] = this.data ? [...this.data] : [];

    /* Computed
	============================================*/

    get displayableProperties() {
        return this.headers.map(x => x.propertyName);
    }

    get tableClass() {
        let tableClass = 'table';
        if (this.hover) tableClass += ' table-hover';
        if (this.striped) tableClass += ' table-striped';
        if (this.bordered) tableClass += ' table-bordered';
        if (this.condensed) tableClass += ' table-condensed';
        if (this.sortDisabled) tableClass += ' sort-disabled';
        return tableClass;
    }

    /* Methods
	============================================*/

    createHeaderData(columns: string[]) {
        if (!columns || !Array.isArray(columns)) {
            columns = Object.keys(this.data[0]);
        }
        const headers = [];
        for (let i = 0; i < columns.length;i++) {
            headers[i] = new SortableHeader(columns[i]);
        }
        this.headers = headers;
    }

    // Sort column by header name
    sort(header: SortableHeader) {
        if (this.sortDisabled) return;
        const prop = header.propertyName, self = this;

        if (!header.isSorted) {
            this.headers.forEach(h => h.resetSort());
            header.isSorted = true;
        } else {
            header.descending = !header.descending;
        }

        // If a sort rule is defined, assume the parent controls sorting
        if (self.sortRule) {
            self.$emit('sort', {
                propertyName: prop,
                orderByDescending: header.descending
            });
        } else {
            self.sortedData.sort(dynamicSort(header.getSortProp()));
            self.$emit('sort', header);
        }
        self.activeSort = prop;
    }

    /* Lifecycle Hooks
	============================================*/

    mounted() {
        this.createHeaderData(this.columns);
    }

    /* Watchers
	============================================*/
    @Watch('columns')
    onColumnsChange(newCols: any) {
        this.createHeaderData(newCols);
    }

    @Watch('data')
    onDataChange(newData: any) {
        this.sortedData = [...newData];
    }

}

</script>

<style lang="scss"></style>