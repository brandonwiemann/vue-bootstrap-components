
module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": ["plugin:vue/strongly-recommended"],
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module",
		"parser": "babel-eslint"
	},
	"plugins": [,
		"vue"
	],
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1
			}
		],
		"lines-between-class-members": ["warn", "always"],
		"vue/component-name-in-template-casing": ["error", "kebab-case"],
		"vue/order-in-components": [
			"error", {
				"order": [
					"el",
					"name",
					"extends",
					"functional",
					"mixins",
					"inheritAttrs",
					"model",
					"props",
					["components", "directives", "filters"],
					"computed",
					"data",
					"methods",
					"LIFECYCLE_HOOKS",
					"watch"
				]
			}
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		'vue/html-indent': ['warn', 'tab', {
			'attribute': 1,
			'baseIndent': 1,
			'closeBracket': 0,
			'alignAttributesVertically': true,
			'ignores': []
		}],
		'vue/max-attributes-per-line': ['error', {
			'singleline': 4,
			'multiline': {
			  'max': 1,
			  'allowFirstLine': false
			}
		}],
		'vue/singleline-html-element-content-newline': ['error', {
			'ignoreWhenNoAttributes': true,
			'ignoreWhenEmpty': true,
			'ignores': [
				'pre',
				'textarea',
				'a',
				'abbr',
				'audio',
				'b',
				'bdi',
				'bdo',
				'canvas',
				'cite',
				'code',
				'data',
				'del',
				'dfn',
				'em',
				'i',
				'iframe',
				'ins',
				'kbd',
				'label',
				'map',
				'mark',
				'noscript',
				'object',
				'output',
				'picture',
				'q',
				'ruby',
				's',
				'samp',
				'small',
				'span',
				'strong',
				'sub',
				'sup',
				'svg',
				'time',
				'u',
				'var',
				'video'
			]
		}],
		"no-unused-vars": "error"
	}
};