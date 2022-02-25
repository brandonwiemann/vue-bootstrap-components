import { mount } from '@vue/test-utils';
import SelectList from '@/components/forms/SelectList.vue';

describe('SelectList.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(SelectList, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

	it('mounts with a placeholder option when placeholder prop is defined', () => {
		const placeholder = 'Placeholder? I hardly know her.';
		const wrapper = mount(SelectList, {
			propsData: {
				placeholder: placeholder,
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
		expect(wrapper.findAll('option').at(0).text()).toBe(placeholder);
	});

});