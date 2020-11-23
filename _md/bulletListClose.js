const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.bullet_list_close || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Return the render with the closing div
	return defaultRender(tokens, idx, options, env, self) + "</div>"
}