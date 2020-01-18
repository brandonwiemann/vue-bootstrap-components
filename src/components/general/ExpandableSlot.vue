<template>
	<div class="exs-item">
		<div :class="['exs-item-collapsed flex-row flex-between', {'exs-open': open}]" v-on:click="$emit('open')">
			<div class="flex-row">
				<div v-if="image" class="exs-image">
					<img :src="image" />
				</div>
				<div>{{name}}</div>
			</div>
			<div>
				<span class="pull-right exs-delete" v-on:click.stop="$emit('delete')" v-if="showDelete">
					<i class="fas fa fa-times"></i> Delete
				</span>
				<span class="pull-right exs-reorder" v-if="showReorder">
					<i class="fas fa fa-arrows-v"></i> Reorder
				</span>
				<span class="pull-right exs-edit" v-if="showEdit" v-on:click.stop="$emit('edit')">
					<i class="fas fa fa-pencil"></i> Edit
				</span>
			</div>
		</div>
		<div v-if="open" class="exs-item-content">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ExpandableSlot',
	props: {
		image: String,
		name: String,
		open: Boolean,
		showDelete: {
			type: Boolean,
			default: true
		},
		showReorder: {
			type: Boolean,
			default: true
		},
		showEdit: {
			type: Boolean,
			default: true
		}
	}
}
</script>

<style lang="less">
	.exs-item {
		background: #FFF;
		border: solid 1px #BBB;
	}
	.exs-item-collapsed {
		background: #EEE;
		cursor: pointer;
		padding: 12px;
	}
	.exs-item-content {
		border-top: solid 1px #BBB;
		padding: 8px;
	}
	.exs-delete:hover {
		color: red;
	}
	.exs-reorder, .exs-edit {
		margin-right: 10px;
		&:hover {
			color: #3959a2;
		}
	}
	.exs-image {
		background-color: #FFF;
		border: solid 1px #BBB;
		margin-right: 10px;
		height: 50px;
		width: 50px;
		padding: 2px;
		img {
			width: 100%;
		}
	}
</style>