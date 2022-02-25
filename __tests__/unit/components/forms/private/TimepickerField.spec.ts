import { mount } from '@vue/test-utils';
import TimepickerField from '@/components/forms/private/TimepickerField.vue';

describe('TimepickerField.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(TimepickerField, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});