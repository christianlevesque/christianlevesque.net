const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.paragraph_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]
	console.log(token)
	// Add Bootstrap classes
	token.attrPush(["class", "col-12 my-2"])

	// Return the render
	return defaultRender(tokens, idx, options, env, self)
}