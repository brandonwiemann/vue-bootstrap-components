import { mount } from '@vue/test-utils';
import FileUploader from '@/components/forms/FileUploader.vue';

describe('FileUploader.vue', () => {

	it('mounts without error', () => {
		const wrapper = mount(FileUploader, {
			propsData: {
				value: ''
			}
		});
		expect(wrapper).toBeTruthy();
	});

});