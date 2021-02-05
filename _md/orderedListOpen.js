const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.ordered_list_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add Bootstrap classes
	token.attrPush(["class", "post__list post__list--ordered"])

	// Return with opening div wrapper
	return defaultRender(tokens, idx, options, env, self)
}