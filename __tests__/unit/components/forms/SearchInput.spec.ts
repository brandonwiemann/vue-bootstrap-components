import { mount } from '@vue/test-utils';
import SearchInput from '@/components/forms/SearchInput.vue';
import { runBaseFormFieldTests } from '../base-form-tests';
import { runBaseInputFieldTests } from '../base-input-tests';
import { findByTestAttribute } from '../../../helpers/vue-test-utils.helper';

describe('SearchInput.vue', () => {

	const INPUT_TEXT = 'The Human Torch was denied a bank loan.';

	runBaseFormFieldTests(SearchInput);
	runBaseInputFieldTests(SearchInput);

	it('emits a search event when user clicks search button', async () => {
		const wrapper = mount(SearchInput, {
			propsData: {
				value: INPUT_TEXT
			}
		});
		const btn = await findByTestAttribute(wrapper, 'search-button');
		await btn.trigger('click');
		expect(wrapper.emitted().search).toBeTruthy();
		expect(wrapper.emitted().search[0][0]).toBe(INPUT_TEXT);
	});

	it('emits an empty input event when user clicks clear input button', async () => {
		const wrapper = mount(SearchInput, {
			propsData: {
				value: INPUT_TEXT
			}
		});
		const btn = await findByTestAttribute(wrapper, 'clear-input-button');
		await btn.trigger('click');
		expect(wrapper.emitted().input).toBeTruthy();
		expect(wrapper.emitted().input[0][0]).toBe('');
	});

});