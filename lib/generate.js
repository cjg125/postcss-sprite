const { resolve, join } = require('path')
const mkdirp = require('mkdirp')
const Spritesmith = require('spritesmith')
const { writeFileSync } = require('fs')

module.exports = class {
  constructor(options = {}) {
    this.spriteName = options.spriteName || 'sprite.png'
    this.imagePath = resolve(options.imagePath || './')
    this.spritePath = resolve(options.spritePath || './')
    this.images = []
    this.decls = []
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

    let reg = /url\((?:['"])?([^\)'"]+)(?:['"])?\)/

    let result = url.match(reg)

    result && (url = result[1])

    return url
  }

  isSupportedUrl(url) {
    let http = /^http[s]?/gi;
    let base64 = /^data\:image/gi;
    return !http.test(url) && !base64.test(url);
  }

  /**
   * imagePath = /Users/test/project/
   * url = /img/1.png => /Users/test/project/img/1.png
   * url = ../img/1.png => /Users/test/img/1.png
   *
   * @param {any} url
   * @returns
   */
  getFullUrl(url) {
    let imagePath = this.imagePath
    if (/^\//) { // 绝对路径
      url = join(imagePath, url)
    } else {
      url = resolve(imagePath, url)
    }
    return url
  }

  generateCss(options) {
    let { coordinates } = options
    return new Promise((resolve, reject) => {
      this.decls.forEach((decl) => {
        let val = decl.value
        let imageurl = this.getImageUrl(val)
        let getFullUrl = this.getFullUrl(imageurl)
        let { width, height, x, y } = coordinates[getFullUrl]
        decl.value = val.replace(/([\w-\.]+\.png)/, ($0) => {
          return this.spriteName
        })
        decl.parent.insertAfter(0, {
          prop: 'background-position',
          value: (-x + 'px') + ' ' + (-y + 'px')
        })
      })
      resolve()
    })
  }

  generateSprite() {
    return new Promise((resolve, reject) => {
      Spritesmith.run({
        src: this.images,
        padding: 2
      }, (err, result) => {
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
      mkdirp(path, function(err) {
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
    if (this.isSupportedUrl(url)) {
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