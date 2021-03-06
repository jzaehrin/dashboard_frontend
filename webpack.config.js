const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const _src = path.resolve(__dirname, 'src');
const _dist = path.resolve(__dirname, 'dist');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(_src, 'app.html'),
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  entry: path.resolve(_src, 'app.js'),
  module: {
    loaders: [
      {test: /react-icons\/(.)*(.js)$/, loader: 'babel', include: path.resolve(__dirname, './node_modules/react-icons/md'), query: {presets: ['es2015', 'react']}},
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.css$/, loaders: ['style-loader', 'css-loader?sourceMap&modules&localIdentName=[name]__[local]__[hash:base64:5]']},
      {test: /\.less$/, loaders: ['style-loader', 'css-loader', 'less-loader']},
      {test: /\.png$/, exclude: /node_modules/, loader: 'url-loader', query: {limit: 100000}},
      {test: /\.jpe?g$/, exclude: /node_modules/, loaders: ['file-loader']},
      {test: /\.json$/, loaders: ['json-loader']},
    ],
  },
  output: {
    filename: 'app.bundle.js',
    path: _dist,
  },
  plugins: [HtmlWebpackPluginConfig],
};
