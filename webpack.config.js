﻿'use strict';

require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProd = process.env.NODE_ENV === 'production';

const config = {
	output: {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
		filename: '[name].js',
		library: "vue-admin-components",
        libraryTarget: "umd"
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.less$/,
				use: [
					(isProd ? MiniCssExtractPlugin.loader : 'style-loader'),
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]'
					}
				}]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.css', '.less', '.vue']
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new webpack.ProvidePlugin({
			Vue: 'vue'
		}),
		new VueLoaderPlugin(),
	]
};

module.exports = config;
