<template>
	<div :class="['admin-form', {'form-horizontal': horizontal}]">
		<slot></slot>
	</div>
</template>

<script>
import { debounce, isPromise } from '../../helpers/functions';
export default {
	name: 'AdminForm',
	props: {
		horizontal: Boolean
	},
	data() {
		return {
			errors: 0
		}
	},
	methods: {

		setChildrenCanValidate(component, canValidate) {
			let self = this;
			if(component.hasOwnProperty('canValidate')) {
				component.canValidate = canValidate;
			}
			if(component.$children && component.$children.length > 0) {
				for(let i=0; i<component.$children.length; i++) {
					self.setChildrenCanValidate(component.$children[i], canValidate);
				}
			}
		},

		setChildrenHorizontal(component, isHorizontal) {
			if(component.hasOwnProperty('isHorizontal')) {
				component.isHorizontal = isHorizontal
			}
			if(component.$children && component.$children.length) {
				for(let i=0; i<component.$children.length; i++) {
					this.setChildrenHorizontal(component.$children[i], isHorizontal);
				}
			}
		},

		submit() {
			let self = this;
			self.setChildrenCanValidate(self, true);
			self.$nextTick(() => {
				self.validateChildren().then((valid) => {
					if(!valid) return;
					self.$emit('submit');
					self.setChildrenCanValidate(self, false);
				});
			});
		},

		validateChildren() {
			return new Promise((resolve, reject) => {
				this.errors = 0;
				this.validateComponent(this).then(() => {
					resolve(this.errors === 0);
				});
			});
		},

		validateComponent(component) {
			return new Promise((resolve, reject) => {
				if(component.hasOwnProperty('validate')) {
					component.validate().then((isValid) => {
						if(!isValid) this.errors++;
						this.validateComponentChildren(component).then(resolve);
					});
				} else {
					this.validateComponentChildren(component).then(resolve);
				}
			});
		},

		validateComponentChildren(component) {
			return new Promise((resolve, reject) => {
				let promises = [];
				if(component.$children && component.$children.length > 0) {
					for(let i=0; i<component.$children.length; i++) {
						promises.push(this.validateComponent(component.$children[i]));
					}
				}
				Promise.all(promises).then(resolve);
			});
		}

	},
	watch: {
		horizontal: function(isHorizontal, wasHorizontal) {
			if(typeof isHorizontal === 'boolean' && isHorizontal !== wasHorizontal) {
				this.setChildrenHorizontal(this, isHorizontal);
			}
		}
	},
	mounted() {
		this.setChildrenHorizontal(this, this.horizontal);
	}
}
</script>