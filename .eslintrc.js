module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/essential',
		'eslint:recommended',
		'@vue/typescript/recommended'
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		/* Vanilla Rules
		============================================*/

		'indent': ['error', 'tab', {
			'SwitchCase': 1
		}],
		'lines-between-class-members': 0,
		'prefer-const': 0,
		'no-console': ['warn', {
			allow: ['warn']
		}],
		'no-debugger': 'warn',
		'no-useless-escape': 0,
		'quotes': ['error', 'single'],
		'semi': ['error', 'always'],

		/* Typescript-eslint rules
		============================================*/

		'@typescript-eslint/no-inferrable-types': 0,
		'@typescript-eslint/no-this-alias': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'@typescript-eslint/interface-name-prefix': 0,

		/* Vue Rules
		============================================*/

		'vue/component-name-in-template-casing': ['error', 'kebab-case'],
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: []
			}
		],
		'vue/html-self-closing': [
			'warn',
			{
				html: {
					normal: 'never',
					void: 'always'
				}
			}
		],
		'vue/max-attributes-per-line': [
			'error',
			{
				singleline: 4,
				multiline: {
					max: 1,
					allowFirstLine: false
				}
			}
		],
		'vue/singleline-html-element-content-newline': 'off',
		'vue/require-default-prop': 0,
	},
	overrides: [
		{
			files: [
				'**/__tests__/*.{j,t}s?(x)',
				'**/tests/unit/**/*.spec.{j,t}s?(x)'
			],
			env: {
				jest: true
			}
		}
	]
};
