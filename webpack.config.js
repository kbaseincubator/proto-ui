const path = require('path');
const dir = path.resolve(__dirname);

module.exports = {
  mode: process.env.DEVELOPMENT ? 'development' : 'production',
  entry: dir + '/src/static/js/index.js',
  output: {
    filename: 'bundle.js',
    path: dir + '/src/static/js/build',
  },
  devServer: {
    contentBase: dir + '/docs',
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', 'mobx'],
          }
        }
      }
    ]
  }
};
