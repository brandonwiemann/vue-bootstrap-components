import { mount } from '@vue/test-utils';
import ImageCompressorModal from '@/components/general/ImageCompressorModal.vue';

describe('ImageCompressorModal.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(ImageCompressorModal, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});