import { mount } from '@vue/test-utils';
import FormFieldWrapper from '@/components/forms/private/FormFieldWrapper.vue';

describe('FormFieldWrapper.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(FormFieldWrapper);
		expect(wrapper).toBeTruthy();
	});

});