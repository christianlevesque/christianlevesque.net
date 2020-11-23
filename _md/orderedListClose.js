const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.ordered_list_close || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Render with closing div wrapper
	return defaultRender(tokens, idx, options, env, self) + "</div>"
}