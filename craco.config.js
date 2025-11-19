const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add src to resolve modules
      webpackConfig.resolve.modules = [
        path.resolve(__dirname, "src"),
        "node_modules",
      ];
      return webpackConfig;
    },
  },
};
