// webpack.config.js
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'src/img', to: 'img' }
      ],
    }),
    new ImageminPlugin({
      /*disable: process.env.NODE_ENV !== 'production',*/
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: ({quality: 60}),
      plugins: [imageminMozjpeg({quality: 40})]
    })
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  }
}
