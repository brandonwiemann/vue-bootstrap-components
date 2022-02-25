import { mount } from '@vue/test-utils';
import PillNav from '@/components/general/PillNav.vue';

describe('PillNav.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(PillNav);
		expect(wrapper).toBeTruthy();
	});

});