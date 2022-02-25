import { mount } from '@vue/test-utils';
import RadioButtons from '@/components/forms/RadioButtons.vue';

describe('RadioButtons.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(RadioButtons, {
			propsData: {
				name: 'test',
				value: 'test1',
				values: ['test1', 'test2']
			}
		});
		expect(wrapper).toBeTruthy();
	});

});