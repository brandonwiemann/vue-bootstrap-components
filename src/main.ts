import FormValidator from '@/classes/FormValidator';
import {
    AdminForm,
    AdminFormModal,
    Autocomplete,
    Checkbox,
    Checkboxes,
    ColorPicker,
    ConfirmModal,
    Datepicker,
    DateRange,
    ErrorMessage,
    ExpandableSlot,
    FileUploader,
    FormButton,
    ImageCompressorModal,
    ImageUploader,
    Modal,
    MultiSelect,
    Pagination,
    PillNav,
    RadioButtons,
    SearchInput,
    SearchListing,
    SelectList,
    Slider,
    SortableTable,
    TabNav,
    TextAreaInput,
    TextInput,
    Timepicker,
    TimeRange,
    Toggle,
    ToolTip
} from './components';

/* Vue Plugin
============================================*/

export default {
    install(Vue) {
        Vue.component('AdminForm', AdminForm);
        Vue.component('AdminFormModal', AdminFormModal);
        Vue.component('Autocomplete', Autocomplete);
        Vue.component('Checkbox', Checkbox);
        Vue.component('Checkboxes', Checkboxes);
        Vue.component('ColorPicker', ColorPicker);
        Vue.component('ConfirmModal', ConfirmModal);
        Vue.component('Datepicker', Datepicker);
        Vue.component('DateRange', DateRange);
        Vue.component('ErrorMessage', ErrorMessage);
        Vue.component('ExpandableSlot', ExpandableSlot);
        Vue.component('FileUploader', FileUploader);
        Vue.component('FormButton', FormButton);
        Vue.component('ImageUploader', ImageUploader);
        Vue.component('ImageCompressorModal', ImageCompressorModal);
        Vue.component('Modal', Modal);
        Vue.component('MultiSelect', MultiSelect);
        Vue.component('Pagination', Pagination);
        Vue.component('PillNav', PillNav);
        Vue.component('RadioButtons', RadioButtons);
        Vue.component('SearchInput', SearchInput);
        Vue.component('SelectList', SelectList);
        Vue.component('SearchListing', SearchListing);
        Vue.component('Slider', Slider);
        Vue.component('SortableTable', SortableTable);
        Vue.component('TabNav', TabNav);
        Vue.component('TextAreaInput', TextAreaInput);
        Vue.component('TextInput', TextInput);
        Vue.component('Timepicker', Timepicker);
        Vue.component('TimeRange', TimeRange);
        Vue.component('Toggle', Toggle);
        Vue.component('ToolTip', ToolTip);
        Vue.prototype.$validator = new FormValidator();
    }
};