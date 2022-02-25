import { mount } from '@vue/test-utils';
import AdminForm from '@/components/forms/AdminForm.vue';

describe('AdminForm.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(AdminForm);
		expect(wrapper).toBeTruthy();
	});

});