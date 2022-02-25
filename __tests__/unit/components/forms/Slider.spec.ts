import { mount } from '@vue/test-utils';
import Slider from '@/components/forms/Slider.vue';

describe('Slider.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(Slider, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});