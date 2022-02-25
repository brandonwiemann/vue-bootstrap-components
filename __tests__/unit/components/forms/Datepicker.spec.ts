import { mount } from '@vue/test-utils';
import Datepicker from '@/components/forms/Datepicker.vue';

describe('Datepicker.vue', () => {


	it('mounts without error', () => {
		const wrapper = mount(Datepicker, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});