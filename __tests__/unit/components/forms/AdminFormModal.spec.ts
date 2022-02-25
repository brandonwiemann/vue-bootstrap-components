import { mount } from '@vue/test-utils';
import AdminFormModal from '@/components/forms/AdminFormModal.vue';

describe('AdminFormModal.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(AdminFormModal);
		expect(wrapper).toBeTruthy();
	});

});