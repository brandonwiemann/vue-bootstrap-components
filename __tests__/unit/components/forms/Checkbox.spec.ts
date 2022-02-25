import { mount } from '@vue/test-utils';
import Checkbox from '@/components/forms/Checkbox.vue';

describe('Checkbox.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(Checkbox);
		expect(wrapper).toBeTruthy();
	});

});