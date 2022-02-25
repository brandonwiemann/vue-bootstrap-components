<template>
    <div :class="['admin-form', {'form-horizontal': horizontal}]">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import BaseFormField from './private/BaseFormField.vue';
import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { hasOwnProperty } from '@/helpers/object.helpers';

@Component({
    name: 'AdminForm',
})
export default class AdminForm extends Vue {

    /* Props
	============================================*/

    @Prop({ type: Boolean, required: false })
    readonly horizontal: boolean;

    /* Data
	============================================*/

    canValidate: boolean = false;
    errors: number = 0;

    /* Methods
	============================================*/

    setChildrenCanValidate(component: Vue, canValidate: boolean) {
        const self = this;
        self.canValidate = canValidate;
        if (hasOwnProperty(component, 'canValidate')) {
            (component as BaseFormField).canValidate = canValidate;
        }
        if (component.$children && component.$children.length > 0) {
            for (let i = 0; i < component.$children.length; i++) {
                self.setChildrenCanValidate(component.$children[i], canValidate);
            }
        }
    }

    setChildrenHorizontal(component: Vue, isHorizontal: boolean) {
        if (hasOwnProperty(component, 'isHorizontal')) {
            (component as BaseFormField).isHorizontal = isHorizontal;
        }
        if (component.$children && component.$children.length) {
            for (let i = 0; i < component.$children.length; i++) {
                this.setChildrenHorizontal(component.$children[i], isHorizontal);
            }
        }
    }

    submit() {
        const self = this;
        self.setChildrenCanValidate(self, true);
        self.$nextTick(() => {
            self.validateChildren().then((valid) => {
                this.$emit('validate', valid);
                if (!valid) return;
                self.$emit('submit');
                self.setChildrenCanValidate(self, false);
            });
        });
    }

    validateChildren() {
        return new Promise((resolve) => {
            this.errors = 0;
            this.validateComponent(this).then(() => {
                resolve(this.errors === 0);
            });
        });
    }

    validateComponent(component: Vue) {
        return new Promise((resolve) => {
            if (hasOwnProperty(component, 'validate')) {
                (component as BaseFormField).validate().then((isValid) => {
                    if (!isValid) this.errors++;
                    this.validateComponentChildren(component).then(resolve);
                });
            } else {
                this.validateComponentChildren(component).then(resolve);
            }
        });
    }

    validateComponentChildren(component: Vue) {
        return new Promise((resolve) => {
            const promises = [];
            if (component.$children && component.$children.length > 0) {
                for (let i = 0; i < component.$children.length; i++) {
                    promises.push(this.validateComponent(component.$children[i]));
                }
            }
            Promise.all(promises).then(resolve);
        });
    }

    /* Lifecycle Hooks
	============================================*/

    mounted() {
        this.setChildrenHorizontal(this, this.horizontal);
    }

    updated() {
        // Ensure new children match controlled data

        // horizontal
        if (this.$children.every(x => x['isHorizontal'] === this.horizontal)) return;
        this.setChildrenHorizontal(this, this.horizontal);

        // canValidate
        if (this.$children.every(x => x['canValidate'] === this.canValidate)) return;
        this.setChildrenCanValidate(this, this.canValidate);
    }

    /* Watchers
	============================================*/

    @Watch('horizontal')
    onHorizontalChange(isHorizontal: any, wasHorizontal: any) {
        if (typeof isHorizontal === 'boolean' && isHorizontal !== wasHorizontal) {
            this.setChildrenHorizontal(this, isHorizontal);
        }
    }

}

</script>