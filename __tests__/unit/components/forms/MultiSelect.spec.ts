import { mount } from '@vue/test-utils';
import MultiSelect from '@/components/forms/MultiSelect.vue';

describe('MultiSelect.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(MultiSelect, {
			propsData: {
				anchor: 'test',
				labelKey: 'test',
				data: [],
				value: []
			}
		});
		expect(wrapper).toBeTruthy();
	});

});