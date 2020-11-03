const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight, {
		templateFormats: ["md"]
	})
	eleventyConfig.setBrowserSyncConfig({
		server: {
			baseDir: "build",
			index: "index.html"
		}
	})
}