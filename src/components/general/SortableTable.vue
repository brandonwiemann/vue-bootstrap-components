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

<script>
import { dynamicSort } from '../../helpers/functions';
import SortableHeader from '../../classes/SortableHeader';

export default {
	name: 'SortableTable',
	props: {

		/* Styles
		============================================*/
		bordered: Boolean,
		condensed: Boolean,
		hover: {
			default: true,
			type: Boolean
		},
		striped: {
			default: true,
			type: Boolean
		},

		/* Data
		============================================*/
		columns: Array,
		data: {
			type: Array,
			required: true
		},

		/* Options
		============================================*/
		sortRule: Object,
		sortDisabled: Boolean
	},
	computed: {

		displayableProperties() {
			return this.headers.map(x => x.propertyName);
		},

		tableClass() {
			let tableClass = 'table';
			if(this.hover) tableClass += ' table-hover';
			if(this.striped) tableClass += ' table-striped';
			if(this.bordered) tableClass += ' table-bordered';
			if(this.condensed) tableClass += ' table-condensed';
			if(this.sortDisabled) tableClass += ' sort-disabled';
			return tableClass;
		}
	},
	data() {
		return {
			activeSort: '',
			headers: [],
			sortedData: this.data ? [...this.data] : [],
		}
	},
	methods: {

		createHeaderData(columns) {
			if(!columns || !Array.isArray(columns)) {
				columns = Object.keys(this.data[0]);
			}
			let headers = [];
			for(let i=0; i<columns.length;i++) {
				headers[i] = new SortableHeader(columns[i]);
			}
			this.headers = headers;
		},

		// Sort column by header name
		sort(header) {
			if(this.sortDisabled) return;
			let prop = header.propertyName, self = this;

			if(!header.isSorted) {
				this.headers.forEach(h => h.resetSort());
				header.isSorted = true;
			} else {
				header.descending = !header.descending;
			}

			// If a sort rule is defined, assume the parent controls sorting
			if(!!self.sortRule) {
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

	},
	watch: {
		columns(newCols) {
			this.createHeaderData(newCols);
		},
		data(newData) {
			this.sortedData = [...newData];
		}
	},
	mounted() {
		this.createHeaderData(this.columns);
	}
}
</script>

<style lang="less">
.sortable-table {
	.st-header {
		cursor: pointer;
		user-select: none;
		&:hover {
			background-color: rgba(0,0,0,0.15);
		}
		&.st-sorted {
			background-color: rgba(0,0,0,0.1)
		}
	}
	.st-row-sorted {
		background-color: rgba(0,0,0,0.04)
	}
	.invisible {
		visibility: hidden;
	}
	.st-arrow {
		color: #888;
		font-size: 80%;
	}
	table.sort-disabled {
		.st-header {
			cursor: default;
			&:hover {
				background-color: transparent;
			}
		}
	}
}
</style>