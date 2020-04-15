const webpack = require('webpack');
const path = require('path');

// const env = process.env.NODE_ENV || 'development';
const env = 'production';

const externalAliasesList = [
    'react',
    'react-dom',
];

/** https://webpack.js.org/configuration/externals/#function */
const externals = function(context, request, callback) {
    if (externalAliasesList.includes(request)) {
        return callback(null, 'commonjs ' + request);
    }
    callback();
};

module.exports = {
    mode: env,
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'), // This is where images AND js will go
        publicPath: '', // This is used to generate URLs to e.g. images
        filename: 'react-selectable.js',
        libraryTarget: 'umd',
    },
    externals,
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    }
};
