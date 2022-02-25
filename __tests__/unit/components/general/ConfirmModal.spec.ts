import { mount } from '@vue/test-utils';
import ConfirmModal from '@/components/general/ConfirmModal.vue';

describe('ConfirmModal.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(ConfirmModal);
		expect(wrapper).toBeTruthy();
	});

});