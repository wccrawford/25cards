var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var WebpackOnBuildPlugin = require('on-build-webpack');
var spawn = require('child_process').spawn;

var startProcess = null;

module.exports = [
    {
        name: 'client',
        entry: {
            "client": './src/client.js',
        },
        output: {
            path: path.join(__dirname, 'dst/html'),
            filename: '[name].js'
        },
        module: {
            loaders: [
                {
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
                {
                    test: /.scss$/,
                    loader: 'style!css!sass',
                    exclude: /node_modules/
                },
                {
                    test: /.json$/,
                    loader: 'json',
                    exclude: /node_modules/
                },
                {
                    test: /.jpg$/,
                    loader: 'file',
                    query: {
                        name: 'images/[name].[ext]'
                    }
                },
                {
                    test: /.png$/,
                    loader: 'file',
                    query: {
                        name: 'images/[name].[ext]'
                    }
                }
            ]
        },
        resolveLoader: {
            modulesDirectories: [
                'node_modules',
                'src'
            ]
        }
    },
    {
        name: 'server',
        target: 'node',
        entry: {
            "server": './src/server.js'
        },
        output: {
            path: path.join(__dirname, 'dst'),
            filename: '[name].js' },
        module: {
            loaders: [
                {
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react']
                    }
                // },
                // {
                //     test: /.scss$/,
                //     loader: 'style!css!sass',
                //     exclude: /node_modules/
                // },
                // {
                //     test: /.json$/,
                //     loader: 'json',
                //     exclude: /node_modules/
                // },
                // {
                //     test: /.jpg$/,
                //     loader: 'file',
                //     query: {
                //         name: 'images/[name].[ext]'
                //     }
                // },
                // {
                //     test: /.png$/,
                //     loader: 'file',
                //     query: {
                //         name: 'images/[name].[ext]'
                //     }
                }
            ]
        },
        context: __dirname,
        node: {
            __filename: false,
            __dirname: false
        },
        externals: [nodeExternals()],
        plugins: [
            new WebpackOnBuildPlugin(function(stats) {
                if(startProcess && !startProcess.killed) {
                    console.log('Killing server');
                    startProcess.kill();
                }

                console.log('Starting server');
                startProcess = spawn('node', ['dst/server.js'], { stdio: 'inherit' });
            })
        ],
        resolveLoader: {
            modulesDirectories: [
                'node_modules',
                'src/js'
            ]
        }
    }
];