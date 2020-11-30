const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.heading_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add Bootstrap classes
	token.attrPush(["class", "mt-3 col-12"])

	// Return the render with the opening wrapper div
	return defaultRender(tokens, idx, options, env, self)
}