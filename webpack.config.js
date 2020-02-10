const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        })
    ],
    devtool: "source-map",
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },
    devServer: {
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
