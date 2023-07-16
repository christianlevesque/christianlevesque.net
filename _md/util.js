const md = require("markdown-it")()
const superscript = require('markdown-it-sup');

function defaultRenderer(tokens, idx, options, env, self) {
	return self.renderToken(tokens, idx, options)
}

module.exports = {
	defaultRenderer,
	md: md.use(superscript)
}