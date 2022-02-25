import { mount } from '@vue/test-utils';
import Timepicker from '@/components/forms/Timepicker.vue';

describe('Timepicker.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(Timepicker, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});