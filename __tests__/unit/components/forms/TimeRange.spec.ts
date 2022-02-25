import { mount } from '@vue/test-utils';
import TimeRange from '@/components/forms/TimeRange.vue';

describe('TimeRange.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(TimeRange, {
			propsData: {
				end: '',
				start: '',
			}
		});
		expect(wrapper).toBeTruthy();
	});

});