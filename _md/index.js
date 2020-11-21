const {md} = require("./util")

md.renderer.rules.link_open = require("./linkOpen")

module.exports = md