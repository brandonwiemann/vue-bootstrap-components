module.exports = {
	"plugins": [
		"@babel/proposal-object-rest-spread",
		"lodash",
		"syntax-dynamic-import",
		"transform-async-to-generator",
		"transform-es2015-shorthand-properties",
		["module-resolver", {
			"root": ["./src"],
			"alias": {
				"components": "./src/components",
				"forms": "./src/components/forms",
				"general": "./src/components/general",
				"test": "./src/test",
				"classes": "./src/classes"
			}
		}]
	],
	"presets": [
		["@babel/env", {
			"targets": {
				"browsers": [
					"last 2 versions",
					"> 1%",
					"IE 10"
				]
			}
		}]
	]
};