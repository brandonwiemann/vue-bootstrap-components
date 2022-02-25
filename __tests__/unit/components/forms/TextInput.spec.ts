import TextInput from '@/components/forms/TextInput.vue';
import { runBaseFormFieldTests } from '../base-form-tests';
import { runBaseInputFieldTests } from '../base-input-tests';

describe('TextInput.vue', () => {

	runBaseFormFieldTests(TextInput);
	runBaseInputFieldTests(TextInput);

});
