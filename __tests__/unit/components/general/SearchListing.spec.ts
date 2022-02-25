import { mount } from '@vue/test-utils';
import SearchListing from '@/components/general/SearchListing.vue';

describe('SearchListing.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(SearchListing);
		expect(wrapper).toBeTruthy();
	});

});