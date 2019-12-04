const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const dir = path.resolve(__dirname);
const inDevelopment = !process.env.PRODUCTION;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const exp = {
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
        test: /\.tsx$/i,
        exclude: /node_modules/,
        use: {loader: 'ts-loader'}
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js', '.jsx', '.css'],
  },
  plugins: [
    new CompressionPlugin(),
  ]
};

if (inDevelopment) {
  /* Uncomment this to enable the bundle analyzer server at localhost:8888
  exp.plugins.push(
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  )
  */
}

module.exports = exp;
