import { mount } from '@vue/test-utils';
import ErrorMessage from '@/components/general/ErrorMessage.vue';

describe('ErrorMessage.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(ErrorMessage);
		expect(wrapper).toBeTruthy();
	});

});