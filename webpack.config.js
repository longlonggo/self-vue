const path = require('path');

module.exports = {
    optimization: {
        minimize: false
    },
    entry: './src/js/index.js',
    output: {
        filename: 'mini-vue.js',
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist')
    }
};

