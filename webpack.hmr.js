const defaultConfig = require('./webpack.config.js');
const merge = require('webpack-merge');
const webpack = require('webpack');

const config = merge(defaultConfig, {
	entry: {
		'sandbox': ['./src/sandbox/app.js']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin()
	],
	devServer: {
		port: 3000,
		hot: true,
		headers: { "Access-Control-Allow-Origin": "*" }
	}
});

module.exports = config;