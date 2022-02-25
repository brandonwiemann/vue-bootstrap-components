import { mount } from '@vue/test-utils';
import Toggle from '@/components/forms/Toggle.vue';
import { findByTestAttribute, findNodeByTestAttribute } from '../../../helpers/vue-test-utils.helper';

function mountToggle(initialValue: boolean) {
	return mount(Toggle, {
		propsData: {
			value: initialValue
		}
	});
}

describe('Toggle.vue', () => {

	it('mounts without error', () => {
		const wrapper = mountToggle(false);
		expect(wrapper).toBeTruthy();
	});

	it('mounts with input checked when value is true', () => {
		const wrapper = mountToggle(true);
		const checkbox = findNodeByTestAttribute<HTMLInputElement>(wrapper, 'checkbox');
		expect(checkbox.checked).toBe(true);
	});

	it('mounts with input unchecked when value is false', () => {
		const wrapper = mountToggle(false);
		const checkbox = findNodeByTestAttribute<HTMLInputElement>(wrapper, 'checkbox');
		expect(checkbox.checked).toBe(false);
	});

	it('emits an input event with an inverse value when clicked', async () => {
		const wrapper = mountToggle(false);
		const checkbox = findByTestAttribute(wrapper, 'checkbox');
		await checkbox.trigger('click');
		expect(wrapper.emitted().input[0][0]).toBe(true);
	});

	it('displays helpText prop when populated', () => {
		const HELP_TEXT = 'Check this out';
		const wrapper = mount(Toggle, {
			propsData: {
				helpText: HELP_TEXT,
				value: false
			}
		});

		expect(findByTestAttribute(wrapper, 'help-text').text()).toBe(HELP_TEXT);
	});

	it('does not toggle when clicked while disabled', async () => {
		const wrapper = mount(Toggle, {
			propsData: {
				disabled: true,
				value: false
			}
		});
		const checkbox = findByTestAttribute(wrapper, 'checkbox');
		await checkbox.trigger('click');
		expect(wrapper.emitted().input).toBeUndefined();
		await wrapper.setProps({ disabled: false });
		await checkbox.trigger('click');
		expect(wrapper.emitted().input).toBeTruthy();
	});

});