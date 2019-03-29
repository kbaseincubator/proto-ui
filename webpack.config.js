const path = require('path');
const dir = path.resolve(__dirname);
const inDevelopment = Boolean(process.env.DEVELOPMENT);

module.exports = {
  mode: inDevelopment ? 'development' : 'production',
  devtool: inDevelopment ? 'cheap-module-source-map' : 'hidden-source-map',
  entry: dir + '/src/static/js/index.js',
  output: {
    filename: 'bundle.js',
    path: dir + '/src/static/build/js',
  },
  devServer: {
    contentBase: dir + '/docs',
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              ['@babel/transform-react-jsx', {'pragma': 'h'}],
            ],
          },
        },
      },
    ],
  },
};
