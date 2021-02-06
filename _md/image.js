const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.image || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add classes
	token.attrPush(["class", "post__image"])

	// Return the render
	return defaultRender(tokens, idx, options, env, self)
}