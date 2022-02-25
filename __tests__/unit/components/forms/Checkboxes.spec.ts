import { mount } from '@vue/test-utils';
import Checkboxes from '@/components/forms/Checkboxes.vue';

describe('Checkboxes.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(Checkboxes, {
			propsData: {
				name: 'test',
				value: ['1'],
				values: ['1', '2']
			}
		});
		expect(wrapper).toBeTruthy();
	});

});