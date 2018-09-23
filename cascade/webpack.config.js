module.exports = {
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/assets/favicon/favicon.ico" }])
  ]
};
