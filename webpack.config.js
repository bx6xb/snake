const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

module.exports = (env) => {
  const mode = env.development ? "development" : "production"

  return {
    mode: mode,
    entry: "./src/index.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.[contenthash].js",
      clean: true,
    },
    devServer: {
      port: 4200,
      open: true,
      watchFiles: "src/**/*",
    },
    module: {
      rules: [
        {
          test: /\.sass$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.ts$/,
          use: "ts-loader",
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html",
        inject: "body",
      }),
      new MiniCssExtractPlugin({
        filename: "style.css",
      }),
    ],
  }
}
