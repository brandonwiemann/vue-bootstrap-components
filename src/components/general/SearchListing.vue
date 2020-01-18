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

<script>
import SearchResult from 'classes/SearchResult';
import { dynamicSort, jsonCopy, jsonEquals } from '../../helpers/functions';
import Pagination from './Pagination.vue';
import SearchInput from '../forms/SearchInput.vue';
import SortableTable from './SortableTable.vue';

export default {
	name: 'SearchListing',
	props: {
		bottomPagination: Boolean,
		columns: Array,
		fullList: Array,
		noResultsText: {
			type: String,
			default: 'No results were found.'
		},
		noResultsStyle: Object,
		paginationDisabled: Boolean,
		searchDisabled: Boolean,
		searchResult: {
			type: [Object, SearchResult],
			required: true
		},
		searchProps: Object,
		sortDisabled: Boolean,
		tableProps: Object
	},
	components: {
		Pagination,
		SearchInput,
		SortableTable
	},
	computed: {
		hasFullList() {
			return Array.isArray(this.fullList)
				&& this.fullList.length > 0;
		},
		query() {
			if(!this.result) return {};
			return this.result.query || {};
		}
	},
	data() {
		return {
			lastQuery: null,
			result: null
		}
	},
	methods: {

		paginate(pageNum) {
			this.result.query.pageNum = pageNum;
			this.update();
		},

		search(query) {
			// If the keyword has changed we need to set pageNum back to 1
			if(this.lastQuery && this.query.pageNum !== 1) {
				if(this.lastQuery.keyword !== query) {
					this.query.pageNum = 1;
				}
			}
			this.query.keyword = query;
			this.update();
		},

		rowClicked(item) {
			this.$emit('rowClicked', item);
		},

		sort(sortRule) {
			this.result.sortRule = sortRule;
			this.update();
		},

		update() {
			this.lastQuery = JSON.parse(JSON.stringify(this.query));
			if(this.hasFullList) {
				this.result.getResults(this.fullList);
			}
			this.$emit('input', this.query);
		},

		updateSearchResult(result) {
			if(typeof result === 'SearchResult' || typeof result === 'object') {
				this.result = new SearchResult(result);
				if(this.columns
					&& this.columns.length
					&& (!this.query.columnsToSearch || !this.query.columnsToSearch.length)
					&& typeof this.columns[0] === 'object'
				) {
					this.query.columnsToSearch = this.columns.map(x => x.propertyName);
				}
			}
		}

	},
	mounted() {
		this.updateSearchResult(this.searchResult);
	},
	watch: {
		searchResult(newResult) {
			this.updateSearchResult(newResult);
		}
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