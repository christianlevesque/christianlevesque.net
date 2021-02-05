const {md} = require("./util")

md.renderer.rules.heading_open     = require("./headingOpen")
md.renderer.rules.image            = require("./image")
md.renderer.rules.link_open        = require("./linkOpen")

// Lists
md.renderer.rules.list_item_open     = require("./listItem")
md.renderer.rules.ordered_list_open  = require("./orderedListOpen")
md.renderer.rules.bullet_list_open   = require("./bulletListOpen")

module.exports = md