import { Wrapper } from '@vue/test-utils';

export function findByTestAttribute(wrapper: Wrapper<Vue>, attribute: string) {
	return wrapper.find(`[data-test="${attribute}"]`);
}

export function findAllByTestAttribute(wrapper: Wrapper<Vue>, attribute: string) {
	return wrapper.findAll(`[data-test="${attribute}"]`);
}

export function findNodeByTestAttribute<T extends HTMLElement>(wrapper: Wrapper<Vue>, attribute: string): T {
	return wrapper.find(`[data-test="${attribute}"]`)?.element as T ?? null;
}