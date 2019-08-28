const sptite = require("../index");
const postcss = require("postcss");
const precss = require("precss");
const fs = require("fs");
const { join } = require("path");

const INPUT_PATH = join(__dirname, "src");
const OUTPUT_PATH = join(__dirname, "dest");
const INPUT_CSS_PATH = join(INPUT_PATH, "app.css");
const OUTPUT_CSS_PATH = join(OUTPUT_PATH, "app.css");

fs.readFile(INPUT_CSS_PATH, (err, css) => {
  postcss([
    precss,
    sptite({
      baseSize: 16,
      filename: "sprite.png",
      input: INPUT_PATH,
      output: OUTPUT_PATH,
      publicPath: opts => {
        let { dirname, filename } = opts;
        return join(dirname, filename);
      },
      spritesmithOptions: {},
      revision: true,
      filter: () => true
    })
  ])
    .process(css, {
      from: INPUT_CSS_PATH,
      to: OUTPUT_CSS_PATH
    })
    .then(result => {
      fs.writeFileSync(OUTPUT_CSS_PATH, result.css);
      if (result.map) fs.writeFileSync(`${OUTPUT_CSS_PATH}.map`, result.map);
    });
});
