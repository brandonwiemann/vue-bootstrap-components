<template>
	<div>
		<toggle label="Horizontal Form" v-model="isHorizontal" />
		<div class="admin-form-test">
			<admin-form :horizontal="isHorizontal" ref="_form" @submit="setFormValid" >
				<h3>Form Components</h3>
				<h2 v-if="formValid">Valid!</h2>
				<br/>
				<tool-tip :show="showToolTip" text="I need your attention right here! " scroll position="top">
					<text-input v-model="textInputVal" label="Text Input" :async-validator="validateAsync" rules="required" />
				</tool-tip>
				<text-area-input v-model="textAreaInputVal" label="Text Area Input" rules="required" />
				<search-input
					v-model="search"
					label="Search Input"
				/>
				<select-list label="Select List" v-model="selected">
					<option value="1">Option 1</option>
					<option value="2">Option 2</option>
					<option value="3">Option 3</option>
					<option value="4">Option 4</option>
				</select-list>
				<multi-select
					v-model="multiSelect"
					:data="multiSelectData"
					anchor="anchor"
					labelKey="label"
					label="Multi Select"
					hide-selected
				/>
				<autocomplete
					v-model="autocomplete"
					init-value="testing 123"
					anchor="id"
					labelKey="title"
					label="Autocomplete"
					url="https://jsonplaceholder.typicode.com/todos"
				/>
				<toggle
					label="Toggle"
					v-model="toggled"
					help-text="This is some help text for testing help text"
				/>
				<checkbox label="Single Checkbox" v-model="checkBox" />
				<checkboxes name="checks" label="Multiple Checkboxes" v-model="checked" :values="checkboxes" />
				<radio-buttons name="radios" label="Radio Buttons" v-model="radio" :values="radios" />
				<color-picker v-model="color" label="Color Picker" />
				<datepicker v-model="date" label="Date Picker" />
				<date-range :start.sync="dateRangeStart" :end.sync="dateRangeEnd" label="Date Range" />
				<timepicker
					label="Time Picker"
					v-model="time"
				/>
				<time-range
					label="Time Range"
					:start.sync="timeRangeStart"
					:end.sync="timeRangeEnd"
				/>
				<slider v-model="sliderAmount" label="Slider" />
				<file-uploader v-model="file" label="File Uploader" />
				<image-uploader v-model="image" label="Image Uploader" />
			</admin-form>
		</div>
		<form-button class="btn-success pull-right" size="lg" @click="showToolTip = !showToolTip">
			Test ToolTip
		</form-button>
		<form-button class="btn-success pull-right" size="lg" @click="$refs._form.submit()">
			Test Validation
		</form-button>
		<form-button @click="changeDate">
			Change Date
		</form-button>
	</div>
</template>

<script>
import ToolTip from '../components/general/ToolTip.vue';
export default {
	name: "FormTest",
	props: {},
	components: {
		ToolTip
	},
	computed: {},
	data() {
		return {
			autocomplete: "",
			checkbox: false,
			checked: ["Checkbox 1"],
			checkboxes: ["Checkbox 1", "Checkbox 2", "Checkbox 3"],
			color: "#9152B9",
			checkBox: false,
			date: new Date(),
			dateRangeStart: new Date(),
			dateRangeEnd: new Date(),
			formValid: false,
			file: null,
			image: null,
			isHorizontal: true,
			multiSelect: [],
			multiSelectData: [
				{
					anchor: "1",
					label: "Test 1"
				},
				{
					anchor: "2",
					label: "Test 2"
				},
				{
					anchor: "3",
					label: "Test 3"
				}
			],
			radio: "test",
			radios: ["test", "test2", "test3"],
			search: "search text",
			selected: "1",
			sliderAmount: 0,
			showToolTip: false,
			textInputVal: "Testing!",
			textAreaInputVal: "Testing longer text!",
			toggled: true,
			time: new Date(),
			timeRangeStart: new Date(),
			timeRangeEnd: new Date(),
			timer: null
		};
	},
	methods: {
		changeDate() {
			let start = new Date(2010, 0, 1);
			let end = new Date();
			this.date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
		},
		setFormValid() {
			console.log("VALID!");
			this.formValid = true;
		},
		validateAsync(value) {
			console.log('Validating async', value);
			return new Promise((resolve) => {
				setTimeout(() =>  {
					console.log('Resolving async validator');
					resolve(value.toLowerCase().indexOf('test') === -1 ? 'Field must contain "test"' : null);
				}, 1000);
			});
		}
	}
};
</script>

<style>
body {
	min-height: 2000px;
}
</style>