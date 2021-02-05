const {md} = require("./util")

md.renderer.rules.blockquote_open  = require("./blockquoteOpen")
md.renderer.rules.blockquote_close = require("./blockquoteClose")
md.renderer.rules.heading_open     = require("./headingOpen")
md.renderer.rules.image            = require("./image")
md.renderer.rules.link_open        = require("./linkOpen")
md.renderer.rules.paragraph_open   = require("./paragraphOpen")

// Lists
md.renderer.rules.list_item_open     = require("./listItem")
md.renderer.rules.ordered_list_open  = require("./orderedListOpen")
md.renderer.rules.bullet_list_open   = require("./bulletListOpen")

module.exports = md