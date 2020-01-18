'use strict';

const merge = require('webpack-merge');
const defaultConfig = require('./webpack.config.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
	mode: 'production',
	entry: {
		'index': ['./src/index.js']
	},
	devtool: 'none',
	performance: {
		hints: false
	},
	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				sourceMap: false,
				extractComments: true,
			})
		]
	},
	externals: {
		bootstrap: 'bootstrap',
		vue: 'Vue'
	},
	plugins: [
		// new BundleAnalyzerPlugin()
	]
};

module.exports = merge(defaultConfig, config);