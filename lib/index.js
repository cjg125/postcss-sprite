const postcss = require('postcss')
const Generate = require('./generate')

module.exports = postcss.plugin('postcss-sprite', (options = {}) => {
  let generate = new Generate(options)

  return (root, result) => {
    root.walkRules((rule) => {
      rule.walkDecls(/background(-image)?/, (decl, index) => {
        generate.push(decl)
      })
    })
    if (generate.images.length == 0) {
      return Promise.resolve()
    }
    return generate.run()
  }
})