const {
  resolve,
  join,
  dirname
} = require('path')
const mkdirp = require('mkdirp')
const Spritesmith = require('spritesmith')
const {
  writeFileSync
} = require('fs')

module.exports = class {
  constructor(options = {}) {
    this.spriteName = options.spriteName || 'sprite.png'
    this.basePath = resolve(options.basePath || './')
    this.spritePath = resolve(options.spritePath || './')
    this.spritesmithOptions = options.spritesmithOptions || {}
    this.cssImagePath = options.cssImagePath
    this.filter = options.filter || function () {
      return true
    }
    this.images = []
    this.decls = []
    this.baseSize = options.baseSize
  }

  /**
   * url("../img/1.png") no-repeat => ../img/1.png
   *
   * @returns
   */
  regImageUrl() {
    return /url\((?:['"])?([^\)'"]+)(?:['"])?\)/
  }

  /**
   * url(./img/1.png) 0 0 no-repeat
   * =>
   * ./img/1.png
   *
   * @param {any} url
   * @returns
   */
  getImageUrl(url) {

    let result = url.match(this.regImageUrl())

    result && (url = result[1])

    return url
  }

  /**
   * ./ or ../ or / => true
   *
   * @param {any} url
   * @returns
   */
  isSupportedUrl(url) {
    return /^(\.\.\/|\.\/|\/)/.test(url)
  }

  /**
   * basePath = /Users/test/project/
   * url = /img/1.png => /Users/test/project/img/1.png
   * url = ../img/1.png => /Users/test/img/1.png
   *
   * @param {any} url
   * @returns
   */
  getFullUrl(url) {
    let basePath = this.basePath
    if (/^\//) { // 绝对路径
      url = join(basePath, url)
    } else {
      url = resolve(basePath, url)
    }
    return url
  }

  /**
   * xxx@2x.jpg
   * => 2
   */
  getDpr(url) {
    let dpr = 1
    try {
      dpr = url.match(/@(\d)x/)[1]
    } catch (e) {}
    return dpr
  }

  generateCss(options) {
    let {
      coordinates,
      properties
    } = options

    return new Promise((resolve, reject) => {
      this.decls.forEach((decl) => {
        let val = decl.value
        let imageurl = this.getImageUrl(val)
        let getFullUrl = this.getFullUrl(imageurl)
        let {
          width,
          height,
          x,
          y
        } = coordinates[getFullUrl]
        let unit = this.baseSize ? 'rem' : 'px'
        let baseSize = this.baseSize || 1
        let dpr = 1
        let spriteWidth = properties.width
        let spriteHeight = properties.height


        decl.value = val.replace(this.regImageUrl(), ($0, $1) => {
          dpr = this.getDpr($0) * baseSize
          spriteWidth /= dpr
          spriteHeight /= dpr
          x /= dpr
          y /= dpr
          width /= dpr
          height /= dpr
          if (this.cssImagePath) {
            // return this.cssImagePath+this.spriteName
            return `url("${this.cssImagePath+'/'+this.spriteName}")`
          }
          return `url("${dirname($1)+'/'+this.spriteName}")`
        })
        decl.parent.insertAfter(0, {
          prop: 'width',
          value: `${width}${unit}`
        }).insertAfter(1, {
          prop: 'height',
          value: `${height}${unit}`
        }).insertAfter(2, {
          prop: 'background-position',
          value: `${-x}${unit} ${-y}${unit}`
        }).insertAfter(3, {
          prop: 'background-size',
          value: `${spriteWidth}${unit} ${spriteHeight}${unit}`
        })
      })
      resolve()
    })
  }

  generateSprite() {
    return new Promise((resolve, reject) => {
      Spritesmith.run(Object.assign({
        src: this.images
      }, this.spritesmithOptions), (err, result) => {
        if (err) {
          return reject(err)
        }
        this.mkdir(this.spritePath).then(() => {
          // result.image // Buffer representation of image
          // result.coordinates // Object mapping filename to {x, y, width, height} of image
          // result.properties // Object with metadata about spritesheet {width, height}
          writeFileSync(join(this.spritePath, this.spriteName), result.image);
          resolve({
            coordinates: result.coordinates,
            properties: result.properties
          })
        }).catch((err) => {
          reject(err)
        })
      })
    })
  }

  mkdir(path) {
    return new Promise((resolve, reject) => {
      mkdirp(path, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  push(decl) {
    let url = this.getImageUrl(decl.value)
    if (this.isSupportedUrl(url) && this.filter(url)) {
      let fullUrl = this.getFullUrl(url)

      // 去重复
      if (this.images.indexOf(fullUrl) < 0) {
        this.images.push(fullUrl)
      }
      this.decls.push(decl)
    }
  }

  run() {
    return this.generateSprite().then(this.generateCss.bind(this))
  }
}