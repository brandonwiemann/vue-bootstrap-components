import { dynamicSort } from '../helpers/sorting.helpers';
import { jsonCopy } from '../helpers/json.helpers';

export default class SearchResult {

    constructor(obj) {
        this.results = [];
        this.totalResults = 0;
        this.query = {
            columnsToSearch: [],
            keyword: '',
            pageNum: 1,
            resultsPerPage: 50,
            sortRule: {
                columnName: '',
                orderByDescending: false
            }
        };
        if (typeof obj === 'object') {
            for (const prop in obj) {
                if (this[prop] !== undefined) {
                    this[prop] = obj[prop];
                }
            }
        }
    }

    getResults(data) {
        if (!Array.isArray(data)) {
            throw 'data argument must be an array of objects';
        }

        if (!data.length) return;

        if (typeof data[0] !== 'object') {
            throw 'data argument must be an array of objects';
        }

        if (data.length > 10000) {
            console.warn('A large array was passed to SearchResult.getResults(). This can result in slow performance');
        }

        data = jsonCopy(data);
        let results = this._searchByKeyword(data);
        results = this._sort(results);
        results = this._paginate(results);
        this.results = results;
    }

    /* Update methods
	============================================*/

    _getSearchableColumns() {
        if (!this.columnsToSearch || this.columnsToSearch.length) {
            console.warn('No searchable columns have been defined');
        }
        return this.columnsToSearch || [];
    }

    _searchByKeyword(data) {
        if (!this.query.keyword) return data;
        const props = this._getSearchableColumns(data);
        if (!props.length) return data;
        const q = this.query.keyword.toLowerCase();
        const results = [];
        for (let i = 0;i < props.length;i++) {
            const prop = props[i];
            for (let j = 0; j < data.length; j++) {
                const value = data[j][prop];
                if (!value) continue;
                if (value.toLowerCase().indexOf(q) > -1) {
                    results.push(data[j]);
                }
            }
        }
        return results;
    }

    _sort(data) {
        if (!this.query.sortRule || !this.query.sortRule.columnName) {
            return data;
        }
        let prop = this.query.sortRule.columnName;
        if (this.query.sortRule.orderByDescending) {
            prop = '-' + prop;
        }
        data.sort(dynamicSort(prop));
        return data;
    }

    _paginate(data) {
        this.totalResults = data.length;
        if (!data.length) return data;
        const start = (this.query.pageNum - 1) * this.query.resultsPerPage;
        if (start > this.totalResults) return data;
        if (start > 0) {
            data = data.splice(start);
        }
        if (this.query.resultsPerPage < data.length) data.length = this.query.resultsPerPage;
        return data;
    }
}