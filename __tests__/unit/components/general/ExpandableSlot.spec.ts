import { mount } from '@vue/test-utils';
import ExpandableSlot from '@/components/general/ExpandableSlot.vue';

describe('ExpandableSlot.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(ExpandableSlot);
		expect(wrapper).toBeTruthy();
	});

});