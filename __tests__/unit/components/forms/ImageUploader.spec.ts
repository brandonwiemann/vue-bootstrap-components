import { mount } from '@vue/test-utils';
import ImageUploader from '@/components/forms/ImageUploader.vue';

describe('ImageUploader.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(ImageUploader);
		expect(wrapper).toBeTruthy();
	});

});