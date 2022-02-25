<template>
	<div class="pagination-wrapper" v-if="alwaysShowCount || numPages > 1">
		<div class="pull-right align-right">
			<div><label>{{totalText}}</label></div>
			<ul class="pagination" v-if="numPages > 1">
				<li
					@click="paginate(1)"
					:class="['page-arrow', {'hide-page': !showGoToStart }]"
					v-if="numPages > maxPages"
				>
					<a href="javascript:void(0);">&#10094;&#10094;</a>
				</li>
				<li
					@click="paginate(currentPage - 1)"
					:class="['page-arrow', {'hide-page': currentPage <= 1}]"
				>
					<a href="javascript:void(0);">&#10094;</a>
				</li>
				<li
					v-for="p in pages"
					:class="{'active': p == currentPage}"
					@click="paginate(p)"
					:key="p"
				>
					<a href="javascript:void(0);">{{p}}</a>
				</li>
				<li
					@click="paginate(currentPage + 1)"
					:class="['page-arrow', {'hide-page': currentPage >= numPages}]"
				>
					<a href="javascript:void(0);">&#10095;</a>
				</li>
				<li
					@click="paginate(numPages)"
					:class="['page-arrow', {'hide-page': !showGoToEnd }]"
					v-if="numPages > maxPages"
				>
					<a href="javascript:void(0);">&#10095;&#10095;</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
	name: 'Pagination',
})
export default class Pagination extends Vue {

	/* Props
	============================================*/

	@Prop({type: Number, required: false, default: 4})
	readonly maxPages: number;

	@Prop({type: Number, required: false})
	readonly pageNum: number;

	@Prop({type: Number, required: false, default: 25})
	readonly resultsPerPage: number;

	@Prop({type: Number, required: true})
	readonly totalResults: number;

	@Prop({type: Boolean, required: false, default: false})
	readonly alwaysShowCount: boolean;

	/* Data
	============================================*/

	currentPage: number = 1;
	pages: number[] = [];
	numPages: number = 1;
	showGoToStart: boolean = false;
	showGoToEnd: boolean = false;

	/* Computed
	============================================*/

	get totalText(): string {
		let total = this.totalResults;
		let start = this.currentPage > 1
			? (this.currentPage - 1) * this.resultsPerPage
			: 1;
		let end = this.currentPage * this.resultsPerPage;
		end = end > total ? total : end;
		return `Showing ${start.toLocaleString()} - ${end.toLocaleString()} of ${total.toLocaleString()}`;
	}

	/* Methods
	============================================*/

	updateResult() {

		// Get pagingation data
		let numPages = Math.ceil(this.totalResults / this.resultsPerPage);
		let start = 1, end = numPages;
		let pages = [];
		let max = this.maxPages;
		let middle = Math.floor(max / 2);

		// Limit to show only X page numbers at a time.
		if(numPages > max) {
			// Active page should be third number, unless it is within 2 pages of
			// the first or last page, then adjust accordingly
			start = this.currentPage - middle;
			end = this.currentPage + (max - middle - 1);
			if(start < 1) start = 1;
			if (end <= max) end = (max > numPages ? numPages : max);
			if (end > numPages) end = numPages;
			if(start > end - (max - 1)) start = end - (max - 1);
		}

		// Add the page numbers to an array for v-for loop
		for(let i = start; i <= end; i++) {
			pages.push(i);
		}

		this.pages = pages;
		this.numPages = numPages;
		this.showGoToStart = start > 1;
		this.showGoToEnd = end < numPages;
	}

	paginate(pageNum: number, suppressEvent: boolean = false) {
		if(pageNum === this.currentPage) return;
		if(pageNum < 1 || pageNum > this.numPages) return;
		this.currentPage = pageNum;
		if(!suppressEvent) {
			this.$emit('paginate', pageNum);
		}
		this.updateResult();
	}

	/* Lifecycle Hooks
	============================================*/

	mounted() {
		this.currentPage = this.pageNum ?? 1;
		this.updateResult();
	}

	/* Watchers
	============================================*/

	@Watch('pageNum')
	onPageNumChange(newPage: number) {
		if(newPage !== this.currentPage) {
			this.paginate(newPage, true);
		}
	}

	@Watch('resultsPerPage')
	onResultsPerPageChange() {
		this.paginate(1, true);
	}

	@Watch('totalResults')
	onTotalResultsChange() {
		this.updateResult();
	}

}

</script>