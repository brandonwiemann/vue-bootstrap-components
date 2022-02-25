import { mount } from '@vue/test-utils';
import ToolTip from '@/components/general/ToolTip.vue';

describe('ToolTip.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(ToolTip, {
			propsData: {
				text: 'A tooltip!'
			}
		});
		expect(wrapper).toBeTruthy();
	});

});