<template>
	<div class="tab-nav">
		<h4 v-if="label" style="margin-bottom: 8px">{{label}}</h4>
		<ul class="nav nav-tabs">
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
import PillNav from './PillNav.vue';
export default {
	extends: { ...PillNav },
	name: 'TabNav',
}
</script>