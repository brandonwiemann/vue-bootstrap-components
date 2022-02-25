# vue-bootstrap-components

> A personal bootstrap-based Vue.js component library and sandbox built for the fun of it.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Components](#components)
3. [Forms and Validation](#forms-and-validation)
4. [Development](#developmenth)

## Getting Started

1. Install with npm

``` bash
npm i vue-bootstrap-components -S
```

2. Import the plugin in your entry file and register the plugin with Vue
``` javascript
import Vue from 'vue';
import AdminComponents from 'vue-bootstrap-components';

Vue.use(AdminComponents);
// ...
```

3. Components are globally registered in your vue application and can be used wherver they are needed. See the full list of available components [here]() (TODO).

``` html
<template>
	<text-input label="My Input" v-model="myValue" />
</template>
```
<br/><br/>

## Components
---
**TODO:** Component documentation will go here in an upcoming PR.

<br/><br/>

## Forms and Validation


### Creating a form
---
First, create a wrapping `AdminForm` component with a `ref` attribute and a `@submit` event handler.

```html
<template>
	<admin-form $ref="_form" @submit="submitForm">
	</admin-form>
</template>
```

Next, add a child form field component. We'll use `TextInput` as a simple example

```html
<template>
	<admin-form $ref="_form" @submit="submitForm">
		<text-input
			label="My Input"
			v-model="myValue"
		/>
	</admin-form>
</template>
```

Finally, add a form control such as a `<button>` that will call our `_form` ref's public submit method.

```html
<template>
	<admin-form ref="_form" @submit="submitForm">
		<text-input
			label="My Input"
			v-model="myValue"
		/>
	</admin-form>
	<button type="submit" @click="$refs._form.submit()">Submit Form</button>
</template>
```

That's it! If the form is valid, the `@submit` event will emit triggering our `submitForm` method. If the form is invalid, errors will automatically display below their respective fields and the `@submit` event will not be emitted.

<br/>

### Adding validation
---

Each form component takes a `rules` prop that accepts a specially formatted string value. This `rule|rule2:param` format was inspired by the excellent [vee-validate library](https://logaretm.github.io/vee-validate/) in which each rule is delimited by a pipe `|` and each rule parameter is delimited by a colon `:`. For example, let's ensure our `TextInput` field is required and has a minimum length of 5.

```html
<template>
	<admin-form ref="_form" @submit="submitForm">
		<text-input
			label="My Input"
			v-model="myValue"
			rules="required|minlength:5"
		/>
	</admin-form>
	<button type="submit" @click="$refs._form.submit()">Submit Form</button>
</template>
```
<br/>

### Passing a custom validation function
---

The `rules` prop can also take a custom validation function. This function takes the field value as it's sole argument, and should return `null` when the value is valid or an error string describing the issue when the value is invalid.

```html
<text-input
	label="My Input"
	v-model="myValue"
	:rules="mustBeCapitalized"
/>
```

```typescript
export default {
	data() {
		return {
			myValue: 'test'
		}
	},
	methods: {
		mustBeCapitalized(val) {
			if(val.charAt(0).toUpperCase() !== val.charAt(0)) {
				return 'Value must be capitalized'; // Invalid
			}
			return null; // Valid
		}
	}
}
```

You can also pass an **asynchronous** validation method using the `async-validator` prop and passing a method that returns a promise. Like synchronous validation, this promise should resolve`null` when the value is valid or an error string when the value is invalid.

```html
<text-input
	label="My Input"
	v-model="myValue"
	:async-validator="validateOnServer"
/>
```

```typescript
export default {
	data() {
		return {
			myValue: 'test'
		}
	},
	methods: {
		validateOnServer(val) {
			return new Promise((resolve) => {
				doSomeServerValidation().then((isValid) => {
					if(isValid) resolve(null);
					else resolve('Invalid value');
				});
			});
		}

		// Simplify with async/await if supported
		async validateOnServer(val) {
			let isValid = await doSomeServerValidation(val);
			return isValid ? null : 'Invalid value';
		}
	}
}
```

<br/>

### Registering a global validation rule
---

You can also register new validation rules globally rather than declaring methods in individual components. Say you want to make an `exactmatch` rule that checks for an exact match to a string value. First you need to create a `ValidationFunction` that accepts a single validation request argument. A validation request is an object with three properties:

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| value | `string` | The string value to validate |
| param | `string` | (Optional) A parameter to validate against |
| label | `string` | (Optional) The label of the field being validated
<br/>
Just like our custom `rules` function above, this validation method should also return `null` when the value is valid, and an error string describing the issue when the value is invalid.

```typescript
let exactMatchValidator = ({ value, param, label }) => {
	if(value !== param) {
		// Invalid, return error message
		let name = label || 'Field';
		return `${name} value must exactly match "${param}"`;
	}
	return null; // Valid, return null
};
```

Now, register your validation method using the `$validator` plugin on the Vue instance. Please Note that validator names are **case-insensitive**.

```typescript
this.$validator.registerValidator('exactmatch', exactMatchValidator);
```

Your new validator is now available to use in the `rules` prop of any form component.

```html
<template>
	<text-input
		label="My Input"
		v-model="myValue"
		rules="exactmatch:matchthis"
	/>
</template>
```

<br/><br/>

## Development
---

### Project setup

```bash
git clone git@github.com:brandonwiemann/vue-bootstrap-components.git
```

Install dependencies

```bash
npm i
```

Compile and hot-reload for development
```bash
npm run serve
```

Compiles and minify for production
```bash
npm run build-prod
```

Run unit tests
```bash
npm run test:unit
```

Lints and fix files
```bash
npm run lint
```

## Deployment

1. Pull the latest version of master
2. Create a branch named `release-x-x-x` where `x.x.x` is the new version following the NPM's [semantic versioning guidelines](https://docs.npmjs.com/about-semantic-versioning)
3. Update the version number in package.json to the new version
4. Commit your change with a message of `Release x.x.x` where `x.x.x` is the new version
5. Submit a PR for this release branch
6. The release will automatically be deployed via GitHub Actions when the PR is merged