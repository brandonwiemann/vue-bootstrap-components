import { mount } from '@vue/test-utils';
import FormButton from '@/components/forms/FormButton.vue';

describe('FormButton.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(FormButton);
		expect(wrapper).toBeTruthy();
	});

});