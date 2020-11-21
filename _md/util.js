const md = require("markdown-it")()

function defaultRenderer(tokens, idx, options, env, self) {
	return self.renderToken(tokens, idx, options)
}

module.exports = {
	defaultRenderer,
	md
}