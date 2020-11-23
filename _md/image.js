const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.image || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add Bootstrap classes
	token.attrPush(["class", "img-fluid"])

	// Return with div wrapper
	return "<div class='col-12'>" + defaultRender(tokens, idx, options, env, self) + "</div>"
}