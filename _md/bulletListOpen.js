const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.bullet_list_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add Bootstrap classes
	token.attrPush(["class", "post__list post__list--unordered"])

	// Return the render with the opening wrapper div
	return defaultRender(tokens, idx, options, env, self)
}