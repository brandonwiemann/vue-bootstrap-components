import TextAreaInput from '@/components/forms/TextAreaInput.vue';
import { runBaseFormFieldTests } from '../base-form-tests';
import { runBaseInputFieldTests } from '../base-input-tests';

describe('TextAreaInput.vue', () => {

	runBaseFormFieldTests(TextAreaInput);
	runBaseInputFieldTests(TextAreaInput);

});
