import { mount } from '@vue/test-utils';
import DateRange from '@/components/forms/DateRange.vue';

describe('DateRange.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(DateRange, {
			propsData: {
				start: new Date(),
				end: new Date()
			}
		});
		expect(wrapper).toBeTruthy();
	});

});