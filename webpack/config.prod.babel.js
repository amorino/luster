import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import postcssFocus from 'postcss-focus'
import rucksack from 'rucksack-css'
import lost from 'lost'
import base from './config.base.babel'

module.exports = base({
    mode: 'production',
    devtool: 'hidden-source-map',
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'js/[name].js?[hash]',
        chunkFilename: 'js/[name].js?[hash]',
        publicPath: '/',
    },
    entry: {
        main: [
            'babel-polyfill',
            path.join(__dirname, '..', 'src/main.js'),
        ],
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                sourceMap: true,
                uglifyOptions: {
                    output: {
                        comments: false,
                    },
                    compress: {
                        drop_console: true,
                    },
                },
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    // We use ExtractTextPlugin so we get a seperate CSS file instead
    // of the CSS being in the JS and injected as a style tag
    cssLoaders: [
        MiniCssExtractPlugin.loader,
        'css-loader',
    ],
    // Load Stylus with SourceMaps
    stylusLoaders: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
                sourceMap: true,
                localIdentName: '[local]___[hash:base64:10]',
            },
        },
        'stylus-loader',
    ],
    // In production, we minify our CSS with cssnano
    stylusPlugins: [
        lost(),
        postcssFocus(), // Add a :focus to every :hover
        rucksack({
            autoprefixer: true,
            fallbacks: true,
        }),
    ],
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            inject: true,
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css?[hash]',
            allChunks: true,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
    ],
})
