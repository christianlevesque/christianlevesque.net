const {md, defaultRenderer} = require("./util")

const defaultRender = md.renderer.rules.blockquote_open || defaultRenderer

module.exports = function (tokens, idx, options, env, self) {
	// Get the token
	const token  = tokens[idx]

	// Add Bootstrap classes
	token.attrPush(["class", "blockquote border-left border-primary pl-3"])

	// Return the render with the opening wrapper div
	return "<div class='col-12 p-3'>" + defaultRender(tokens, idx, options, env, self)
}