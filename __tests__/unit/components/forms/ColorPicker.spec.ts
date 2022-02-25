import ColorPicker from '@/components/forms/ColorPicker.vue';
import { runBaseFormFieldTests } from '../base-form-tests';
import { runBaseInputFieldTests } from '../base-input-tests';

describe('ColorPicker.vue', () => {

	runBaseFormFieldTests(ColorPicker);
	runBaseInputFieldTests(ColorPicker);

});