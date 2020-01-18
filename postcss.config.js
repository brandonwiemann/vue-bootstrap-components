module.exports = {
	plugins: [
		require("autoprefixer")({
			browsers: [
				'last 2 versions',
				'IE 10'
			]
		}),
		require("cssnano")({
			preset: 'default',
			reduceIdents: false // Don't rename animation keyframes
		}),
		require("postcss-pixels-to-rem")()
	]
};