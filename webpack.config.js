// var webpack = require('webpack');

module.exports = {
	entry: {
		index: './src/js/index.js'
	},
	output: {
		filename: 'dist/js/[name].js'
	},
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel'},
			{ test: /\.less$/, loader: 'style!css!less'},
			{ test: /\.jpg$/, loader: 'file?name=dist/css/images/[name].[hash:6].[ext]'}
		]
	}
};