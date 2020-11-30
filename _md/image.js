const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.image || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add Bootstrap classes
	token.attrPush(["class", "img-fluid mx-auto d-block my-3"])

	// Return with div wrapper
	// return "<div class='col-12 my-3'>" + defaultRender(tokens, idx, options, env, self) + "</div>"
	return defaultRender(tokens, idx, options, env, self)
}