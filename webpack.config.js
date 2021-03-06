const path = require('path');

module.exports = {
  context: __dirname,
  entry: ['babel-polyfill', './src/App.jsx'],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: './public/',
    filename: 'bundle.js'
  },
  devServer: {
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  stats: {
    colors: true,
    reasons: true,
    chunks: false
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: ['file-loader']
      }
    ]
  }
};
