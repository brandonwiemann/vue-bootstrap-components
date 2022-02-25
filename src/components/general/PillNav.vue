<template>
    <div :class="['pill-nav', {'full-width': fullWidth}]">
        <h4 v-if="label" style="margin-bottom: 8px">{{label}}</h4>
        <ul class="nav nav-pills">
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
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
    name: 'PillNav',
})
export default class PillNav extends Vue {

    /* Props
	============================================*/

    @Prop({ type: Boolean, required: false })
    readonly fullWidth: boolean;

    @Prop({ type: String, required: false, default: '' })
    readonly label: string;

    @Prop({ type: String, required: false, default: '' })
    readonly value: string;

    @Prop({ type: Array, required: false })
    readonly values: string[];

    /* Data
	============================================*/

    activeTab: string = this.value;

    /* Methods
	============================================*/

    setActiveTab(tab: string) {
        if (this.activeTab === tab) return;
        this.activeTab = tab;
        this.$emit('input', tab);
        this.$emit('change', tab);
    }

    /* Watchers
	============================================*/

    @Watch('value')
    onValueChange(newVal: any, oldVal: any) {
        if (newVal !== oldVal) {
            this.activeTab = newVal;
        }
    }

}

</script>

<style lang="scss"></style>