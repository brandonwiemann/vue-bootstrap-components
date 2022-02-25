/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano')({
            preset: 'default',
            reduceIdents: false // Don't rename animation keyframes
        })
    ]
};