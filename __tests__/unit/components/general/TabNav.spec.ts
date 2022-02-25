import { mount } from '@vue/test-utils';
import TabNav from '@/components/general/TabNav.vue';

describe('TabNav.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(TabNav);
		expect(wrapper).toBeTruthy();
	});

});