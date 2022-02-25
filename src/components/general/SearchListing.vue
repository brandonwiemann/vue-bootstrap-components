<template>
	<div class="search-listing">
		<div v-if="result">
			<div class="sl-actions">
				<div class="sl-search">
					<search-input
						v-if="!searchDisabled"
						v-model="query.keyword"
						:font-awesome="true"
						v-bind="searchProps"
						@search="search"
						@clearInput="search"
					/>
				</div>
				<div class="sl-pagination">
					<pagination
						v-if="!paginationDisabled"
						:page-num="query.pageNum"
						:results-per-page="query.resultsPerPage"
						:total-results="result.totalResults"
						@paginate="paginate"
					/>
				</div>
			</div>
			<sortable-table
				:data="result.results"
				:columns="columns"
				:sort-rule="query.sortRule"
				v-bind="tableProps"
				@sort="sort"
				@rowClicked="rowClicked"
				:sort-disabled="sortDisabled"
			/>
			<div v-if="result.results.length === 0 && !!noResultsText" :style="noResultsStyle">
				{{noResultsText}}
			</div>
			<div class="sl-actions" v-if="bottomPagination">
				<div class="sl-search"></div>
				<div class="sl-pagination">
					<pagination
						:page-num="query.pageNum"
						:results-per-page="query.resultsPerPage"
						:total-results="result.totalResults"
						@paginate="paginate"
						v-if="!paginationDisabled"
					/>
				</div>
			</div>
		</div>
	</div>
</template>


<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { AnyObject } from '@/types/generic';
import SearchResult from '@/classes/SearchResult';

@Component({
	name: 'SearchListing',
})
export default class SearchListing extends Vue {

	/* Props
	============================================*/

	@Prop({type: Boolean, required: false})
	readonly bottomPagination: boolean;

	@Prop({type: Array, required: false})
	readonly columns: {propertyName: string}[];

	@Prop({type: Array, required: false})
	readonly fullList: any[];

	@Prop({type: String, required: false, default: 'No results were found.'})
	readonly noResultsText: string;

	@Prop({type: Object, required: false})
	readonly noResultsStyle: AnyObject;

	@Prop({type: Boolean, required: false})
	readonly paginationDisabled: boolean;

	@Prop({type: Boolean, required: false})
	readonly searchDisabled: boolean;

	@Prop({type: Object as () => SearchResult, required: false})
	readonly searchResult: SearchResult;

	@Prop({type: Object, required: false})
	readonly searchProps: AnyObject;

	@Prop({type: Boolean, required: false})
	readonly sortDisabled: boolean;

	@Prop({type: Object, required: false})
	readonly tableProps: AnyObject;

	/* Data
	============================================*/

	lastQuery: any = null;
	result: any = null;

	/* Computed
	============================================*/

	get hasFullList() {
		return Array.isArray(this.fullList)
			&& this.fullList.length > 0;
	}

	get query() {
		if(!this.result) return {};
		return this.result.query || {};
	}

	/* Methods
	============================================*/

	paginate(pageNum: number | string) {
		this.result.query.pageNum = pageNum;
		this.update();
	}

	search(query: string) {
		// If the keyword has changed we need to set pageNum back to 1
		if(this.lastQuery && this.query.pageNum !== 1) {
			if(this.lastQuery.keyword !== query) {
				this.query.pageNum = 1;
			}
		}
		this.query.keyword = query;
		this.update();
	}

	rowClicked(item: AnyObject) {
		this.$emit('rowClicked', item);
	}

	sort(sortRule: any) {
		this.result.sortRule = sortRule;
		this.update();
	}

	update() {
		this.lastQuery = JSON.parse(JSON.stringify(this.query));
		if(this.hasFullList) {
			this.result.getResults(this.fullList);
		}
		this.$emit('input', this.query);
	}

	updateSearchResult() {
		if(this.columns
			&& this.columns.length
			&& (!this.query.columnsToSearch || !this.query.columnsToSearch.length)
			&& typeof this.columns[0] === 'object'
		) {
			this.query.columnsToSearch = this.columns.map(x => x.propertyName);
		}
	}

	/* Lifecycle Hooks
	============================================*/

	mounted() {
		this.updateSearchResult();
	}

	/* Watchers
	============================================*/

	@Watch('searchResult')
	onSearchResultChange() {
		this.updateSearchResult();
	}

}

</script>

<style lang="less" scoped>
.sl-actions {
	align-items: center;
	display: flex;
	justify-content: space-between;
}
.sl-search {
	flex: 0 1 560px;
}
.sl-pagination {
	flex: 0 0 375px;
}
@media only screen and (max-width: 767px) {
	.sl-actions {
		display: block;
	}
}
</style>