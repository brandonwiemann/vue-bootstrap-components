import { mount } from '@vue/test-utils';
import Autocomplete from '@/components/forms/Autocomplete.vue';
import { runBaseFormFieldTests } from '../base-form-tests';
import { findByTestAttribute, findNodeByTestAttribute, findAllByTestAttribute } from '../../../helpers/vue-test-utils.helper';
import '@testing-library/jest-dom';
import { sleep } from '../../../helpers/test.helper';
import { runBaseInputFieldTests } from '../base-input-tests';

describe('Autocomplete.vue', () => {

	const INPUT_TEXT = 'Bears';
	const propsData = {
		debounce: 0,
		anchor: 'id',
		labelKey: 'label',
		minCharacters: 1,
		value: '',
		data: [
			{
				id: 1,
				label: 'Bears'
			},
			{
				id: 2,
				label: 'Beets'
			},
			{
				id: 3,
				label: 'Battlestar Galactica'
			}
		]
	};

	runBaseFormFieldTests(Autocomplete, { propsData });

	it('Mounts with value prop as input field value', () => {
		const wrapper = mount(Autocomplete, {
			propsData: {
				...propsData,
				value: INPUT_TEXT
			}
		});
		const el = wrapper.find('[data-test="input"]').element as HTMLInputElement;
		expect(el.value).toBe(INPUT_TEXT);
	});

	it('emits an input event upon user input', async () => {
		const wrapper = mount(Autocomplete, { propsData });
		await wrapper.find('[data-test="input"]').setValue(INPUT_TEXT);
		expect(wrapper.emitted().input).toBeTruthy();
		expect(wrapper.emitted().input[0][0]).toBe(INPUT_TEXT);
	});

	it('searches by searchLocal when url prop is undefined', async () => {
		const wrapper = mount(Autocomplete, { propsData });
		wrapper.vm['searchLocal'] = jest.fn();
		wrapper.vm['searchExternal'] = jest.fn();
		const input = findByTestAttribute(wrapper, 'input');
		await input.setValue('Bears');
		await sleep(propsData.debounce + 50);
		expect(wrapper.vm['searchLocal']).toHaveBeenCalled();
		expect(wrapper.vm['searchExternal']).toHaveBeenCalledTimes(0);
	});

	it('searches by searchExternal when url prop is defined', async () => {
		const wrapper = mount(Autocomplete, {
			propsData :{
				...propsData,
				url: 'http://www.testytesty.com'
			}
		});
		wrapper.vm['searchLocal'] = jest.fn();
		wrapper.vm['searchExternal'] = jest.fn();
		const input = findByTestAttribute(wrapper, 'input');
		await input.setValue('Bears');
		await sleep(propsData.debounce + 50);
		expect(wrapper.vm['searchExternal']).toHaveBeenCalled();
		expect(wrapper.vm['searchLocal']).toHaveBeenCalledTimes(0);
	});

	it('display list of search results upon user input', async () => {
		const wrapper = mount(Autocomplete, { propsData });
		const input = findByTestAttribute(wrapper, 'input');
		const list = findNodeByTestAttribute<HTMLElement>(wrapper, 'list');
		expect(list).not.toBeVisible();
		await input.setValue('Bears');
		await sleep(propsData.debounce + 50);
		expect(list).toBeVisible();
		const listItems = findAllByTestAttribute(wrapper, 'list-item');
		expect(listItems.length).toBe(1);
		expect(listItems.at(0).text()).toBe('Bears');
	});

	it('emits select event when user clicks on a result', async () => {
		const wrapper = mount(Autocomplete, { propsData });
		const input = findByTestAttribute(wrapper, 'input');
		await input.setValue('Bears');
		await sleep(propsData.debounce + 50);
		const firstResult = findByTestAttribute(wrapper, 'list-item');
		await firstResult.trigger('mousedown');
		expect(wrapper.emitted().select).toBeTruthy();
	});

});