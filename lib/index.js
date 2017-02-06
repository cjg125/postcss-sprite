const postcss = require('postcss')
const Generate = require('./generate')
module.exports = postcss.plugin('postcss-sprite', (options = {}) => {
  let generate = new Generate(options)

  return (root, result) => {
    root.walkRules((rule) => { // 迭代css声明
      rule.walkDecls(/background(-image)?/, (decl, index) => { // 迭代css声明里的css属性
        generate.push(decl)
      })
    })
    if (generate.images.length == 0) {
      return Promise.resolve()
    }
    return generate.run()
  }
})
