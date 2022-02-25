import FormField from '@/components/forms/private/FormField.vue';
import { mount, VueClass, ThisTypedMountOptions } from '@vue/test-utils';
import { findNodeByTestAttribute, findByTestAttribute } from '../../helpers/vue-test-utils.helper';

export function runBaseInputFieldTests<T extends FormField>(
	component: VueClass<T>, options?: ThisTypedMountOptions<T>
) {

	const INPUT_TEXT = 'How come you don\'t have a lazer, Woody?';

	function mountDefault() {
		return mount(component, options ?? {
			propsData: {
				value: INPUT_TEXT
			}
		});
	}

	describe('Common input field tests', () => {

		it('mounts with value prop as input field value', () => {
			const wrapper = mountDefault();
			const input = findNodeByTestAttribute<HTMLInputElement>(wrapper, 'input');
			expect(input.value).toBe(INPUT_TEXT);
		});

		it('emits an input event upon user input', async () => {
			const wrapper = mount(component, {
				propsData: {
					value: ''
				}
			});
			const input = findByTestAttribute(wrapper, 'input');
			await input.setValue(INPUT_TEXT);
			expect(wrapper.emitted().input).toBeTruthy();
			expect(wrapper.emitted().input[0][0]).toBe(INPUT_TEXT);
		});

	});
}