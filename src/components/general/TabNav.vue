<template>
	<div class="tab-nav">
		<h4 v-if="label" style="margin-bottom: 8px">{{label}}</h4>
		<ul class="nav nav-tabs">
			<li
				:class="{'active': activeTab === tab}"
				v-for="tab in values"
				@click.stop="setActiveTab(tab)"
				:key="tab"
			>
				<a href="javascript:void(0)">{{tab}}</a>
			</li>
		</ul>
	</div>
</template>


<script lang="ts">
import { Component } from 'vue-property-decorator';
import PillNav from './PillNav.vue';

@Component({
	name: 'TabNav',
})
export default class TabNav extends PillNav {}

</script>