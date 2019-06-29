const path = require ("path")

module.exports = {
  devServer: {
    public: "4071bdc7b3484ab990f88f16ee6d8c17.vfs.cloud9.eu-west-1.amazonaws.com",
    port: 8081
  },
  outputDir: path.resolve(__dirname, "../server/views/admin"),
  assetsDir: process.env.NODE_ENV === "production"
    ? "../../public/admin"
    : "",
  publicPath: "/admin/",
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/scss/main.scss";`
      }
    }
  }
}