import { mount } from '@vue/test-utils';
import Pagination from '@/components/general/Pagination.vue';

describe('Pagination.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(Pagination, {
			propsData: {
				totalResults: 25
			}
		});
		expect(wrapper).toBeTruthy();
	});

	it('mounts with currentPage set to 1 if no pageNum prop passed', () => {
		const wrapper = mount(Pagination, {
			propsData: {
				totalResults: 25
			}
		});
		expect(wrapper.vm.$data.currentPage).toBe(1);
	});

	it('mounts with currentPage set to pageNum prop', () => {
		const wrapper = mount(Pagination, {
			propsData: {
				totalResults: 25,
				pageNum: 3
			}
		});
		expect(wrapper.vm.$data.currentPage).toBe(3);
	});

});