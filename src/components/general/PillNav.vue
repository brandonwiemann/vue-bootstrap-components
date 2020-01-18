<template>
	<div :class="['pill-nav', {'full-width': fullWidth}]">
		<h4 v-if="label" style="margin-bottom: 8px">{{label}}</h4>
		<ul class="nav nav-pills">
			<li
				:class="{'active': activeTab === tab}"
				v-for="tab in values"
				v-on:click.stop="setActiveTab(tab)"
				:key="tab"
			>
				<a href="javascript:void(0)">{{tab}}</a>
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'PillNav',
	props: {
		fullWidth: Boolean,
		label: String,
		value: String,
		values: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			activeTab: this.value
		}
	},
	methods: {
		setActiveTab(tab) {
			if(this.activeTab === tab) return;
			this.activeTab = tab;
			this.$emit('input', tab);
			this.$emit('change', tab);
		}
	},
    watch: {
        value(newVal, oldVal) {
            if(newVal !== oldVal) {
                this.activeTab = newVal;
            }
        }
    }
}
</script>

<style scoped>
.full-width ul {
	display: flex;
	margin-left: 0;
}
.full-width ul li {
	background-color: #e8e8e8;
	flex: 1 1 auto;
}
.full-width ul li a {
	text-align: center;
}
</style>