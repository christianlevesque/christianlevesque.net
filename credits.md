---
pageTitle: Works I Used
category: courses
blurb: A list of the open source software used to build this website
author: none
---

This site was built with several third-party tools, some of which were built by individual developers. Each of this site's top-level dependencies is listed here.

## Widgets and themes

Most of the visuals on this site are simple or drab. That's by design - after all, I'm a backend developer, not a designer! But some of the work actually looks pretty good, and most of it isn't mine.

- Syntax highlighting is provided by [PrismJS](https://prismjs.com).
- The syntax highlighting theme used on my website is [Prism Material Dark](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-material-dark.css), which was developed by [dutchenkoOleg](https://github.com/dutchenkoOleg).
- The site's layout comes from [Bootstrap](https://getbootstrap.com) (which means I also use [jQuery](https://jquery.com/) and [Popper](https://popper.js.org/)). I themed Bootstrap using Sass overrides to get a customized look.

## Build

No one writes unbundled Javascript anymore, do they? This site was built with a few powerful tools that made my life easier.

- This site was built on [11ty](https://www.11ty.dev).
- Markdown compilation was done with [Markdown-It](https://markdown-it.github.io/markdown-it/)
- Bundling was done with [Webpack](https://webpack.js.org).
- JS transpilation was done with [Babel](https://babeljs.io).
- Sass transpilation was done with [Dart-Sass](https://sass-lang.com/dart-sass)
- CSS processing was done with [PostCSS](https://postcss.org/)

## Infrastructure

The work these libraries do may not be as sexy as Webpack or Babel, but without them, we would have nothing.

- [file-loader](https://www.npmjs.com/package/file-loader)
- [style-loader](https://www.npmjs.com/package/style-loader)
- [css-loader](https://www.npmjs.com/package/css-loader)
- [sass-loader](https://www.npmjs.com/package/sass-loader)
- [autoprefixer](https://www.npmjs.com/package/autoprefixer)
- [postcss-loader](https://www.npmjs.com/package/postcss-loader)
- [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin)
- [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin)
- [copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin)