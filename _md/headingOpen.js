const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.heading_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]
	const classes = `post__heading post__heading--${token.tag.substr(1)}`

	// Add Bootstrap classes
	token.attrPush(["class", classes])

	// Return the render with the opening wrapper div
	return defaultRender(tokens, idx, options, env, self)
}