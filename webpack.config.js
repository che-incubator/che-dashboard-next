const path = require('path');
const webpack = require('webpack');
const stylusLoader = require('stylus-loader');
const stylus_plugin = require('poststylus');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        './src/index.tsx'
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader',
            },
            {
                test: /\.(woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new stylusLoader.OptionsPlugin({
            default: {
                use: [stylus_plugin()],
            },
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    devServer: {
        port: 3000,
        host: '0.0.0.0',
        hot: true,
        proxy: {
            '/api': {
                target: 'https://che.openshift.io/',
                secure: false,
                changeOrigin: true,
                bypass(req) {
                    if (req.url === '/api/nope') {
                        return '/bypass.html';
                    }
                },
            },
        },
    }
};
