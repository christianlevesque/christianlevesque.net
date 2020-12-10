const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.heading_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]
	const classes = token.tag === "h2" ? "mt-3 col-12 border-bottom pb-1 border-dark" : "mt-3 col-12"

	// Add Bootstrap classes
	token.attrPush(["class", classes])

	// Return the render with the opening wrapper div
	return defaultRender(tokens, idx, options, env, self)
}