const path = require('path');
const dir = path.resolve(__dirname);
const inDevelopment = Boolean(process.env.DEVELOPMENT);

module.exports = {
  mode: inDevelopment ? 'development' : 'production',
  devtool: inDevelopment ? 'cheap-module-source-map' : 'hidden-source-map',
  entry: dir + '/src/client/index.tsx',
  output: {
    filename: 'bundle.js',
    path: dir + '/src/static/build',
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: {loader: 'ts-loader'},
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js', '.jsx'],
  },
};
