const path = require('path');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const TsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
// eslint-disable-next-line import/order
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const buildPath = path.resolve(__dirname, 'dist');
const sourcePath = path.resolve(__dirname, 'src');
const publicPath = path.resolve(__dirname, 'public');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getSettingsForStyles = (withModules = false) => {
  return [
    MiniCssExtractPlugin.loader,
    !withModules
      ? 'css-loader'
      : {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: !isProd
                ? '[path][name]__[local]'
                : '[hash:base64]',
            },
          },
        },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['autoprefixer'],
        },
      },
    },
    'sass-loader',
  ];
};

module.exports = {
  entry: path.resolve(sourcePath, 'index.tsx'),
  output: {
    path: buildPath,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.module\.s?css$/,
        use: getSettingsForStyles(true),
      },
      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: getSettingsForStyles(),
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|svg|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(publicPath, 'index.html'),
      filename: './index.html',
    }),
    !isProd && new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new TsCheckerPlugin(),
  ].filter(Boolean),
  devServer: {
    host: '127.0.0.1',
    port: 3000,
    static: {
      directory: publicPath,
    },
    hot: true,
    historyApiFallback: true,
  },
  target: !isProd ? 'web' : 'browserslist',
  devtool: isProd ? 'hidden-source-map' : 'eval-source-map',
  resolve: {
    extensions: ['.tsx', '.jsx', '.js', '.ts'],
    alias: {
      '@components': path.join(sourcePath, 'components/'),
      '@config': path.join(sourcePath, 'config/'),
      '@global': path.join(sourcePath, 'global/'),
      '@mixins': path.join(sourcePath, 'mixins/'),
      '@pages': path.join(sourcePath, 'pages/'),
      '@store': path.join(sourcePath, 'store/'),
      '@styles': path.join(sourcePath, 'styles/'),
      '@entities': path.join(sourcePath, 'entities/'),
      '@utils': path.join(sourcePath, 'utils/'),
    },
  },
};
