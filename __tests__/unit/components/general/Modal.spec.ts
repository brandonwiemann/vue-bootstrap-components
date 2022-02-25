import { mount } from '@vue/test-utils';
import Modal from '@/components/general/Modal.vue';

describe('Modal.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(Modal);
		expect(wrapper).toBeTruthy();
	});

});