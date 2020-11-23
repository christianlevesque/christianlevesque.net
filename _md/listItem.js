const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.list_item_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add Bootstrap classes
	token.attrPush(["class", "mb-3"])

	return defaultRender(tokens, idx, options, env, self)
}