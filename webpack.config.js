const path = require('path');
const webpack = require('webpack');

module.exports = {
    optimization: {
        minimize: false
    },
    entry: './src/js/index.js',
    devServer: {
      contentBase: './dist',
      hot: true
    },
    output: {
        filename: 'mini-vue.js',
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist')
    }
};

