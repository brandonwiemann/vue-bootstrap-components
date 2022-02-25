import { mount } from '@vue/test-utils';
import SortableTable from '@/components/general/SortableTable.vue';

describe('SortableTable.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(SortableTable, {
			propsData: {
				data: [{test: 1}]
			}
		});
		expect(wrapper).toBeTruthy();
	});

});