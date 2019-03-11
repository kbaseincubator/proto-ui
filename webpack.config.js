const path = require('path');
const dir = path.resolve(__dirname);
module.exports = {
  entry: dir + '/src/static/js/index.js',
  output: {
    // filename: '[name].[contenthash].bundle.js',
    filename: 'bundle.js',
    path: dir + '/src/static/js/build',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
};
