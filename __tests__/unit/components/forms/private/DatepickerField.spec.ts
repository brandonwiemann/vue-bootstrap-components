import { mount } from '@vue/test-utils';
import DatepickerField from '@/components/forms/private/DatepickerField.vue';

describe('DatepickerField.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(DatepickerField, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});