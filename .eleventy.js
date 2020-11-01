const pluginSass = require("eleventy-plugin-sass")

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(pluginSass, {
		watch: ["styles/*.scss", "!node_modules/**"],
		outputDir: "build/css"
	})
	eleventyConfig.setBrowserSyncConfig({
		server: {
			baseDir: "build",
			index: "index.html"
		}
	})
}