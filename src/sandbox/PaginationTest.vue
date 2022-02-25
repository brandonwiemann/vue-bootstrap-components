<template>
    <div class="pagination-test">
        <h3>Pagination Test</h3>
        <pagination
            alwaysShow
            :maxPages="maxPages"
            :pageNum="pageNum"
            :resultsPerPage="resultsPerPage"
            :totalResults="totalResults"
            @paginate="handlePaginate"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
    name: 'PaginationTest',
})
export default class PaginationTest extends Vue {

    /* Props
	============================================*/

    /* Data
	============================================*/
    maxPages: number = 4;
    pageNum: number = 3;
    resultsPerPage: number = 25;
    totalResults: number = 100;

    /* Computed
	============================================*/

    /* Methods
	============================================*/

    handlePaginate(newPage) {

    }

    /* Lifecycle Hooks
	============================================*/

    /* Watchers
	============================================*/

}

</script>

<style>
	.pagination-test {
		margin-top: 30px;
	}

	.pagination-wrapper {
		display: flex;
	}
</style>