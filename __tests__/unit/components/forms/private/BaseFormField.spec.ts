import { mount } from '@vue/test-utils';
import BaseFormField from '@/components/forms/private/BaseFormField.vue';

describe('BaseFormField.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(BaseFormField, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});