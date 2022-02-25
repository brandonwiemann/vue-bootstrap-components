import FormField from '@/components/forms/private/FormField.vue';
import { ThisTypedMountOptions, mount, VueClass } from '@vue/test-utils';

export function runBaseFormFieldTests<T extends FormField>(
	component: VueClass<T>, options?: ThisTypedMountOptions<T>
) {

	let wrapper = mount(component, options ?? {
		propsData: {
			value: ''
		}
	});

	describe('Base form field tests', () => {

		it('mounts without error', () => {
			expect(wrapper).toBeTruthy();
		});

		it('is wrapped in a FormFieldWrapper component', () => {
			expect(wrapper.vm.$el.getAttribute('data-test')).toBe('form-field-wrapper');
		});

	});
}