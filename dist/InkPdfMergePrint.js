'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _inkscape = require('inkscape')

var _inkscape2 = _interopRequireDefault(_inkscape)

var _path = require('path')

var _util = require('./util.js')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const dirAndPdfs = new Map()

exports.default = opts => {
  opts.ext = '.pdf'

  const dirpath = (0, _path.normalize)(opts.dir)
  const pdf = {
    filepath: (0, _path.resolve)((0, _path.format)(opts)),
    finish: false
  }

  if (!dirAndPdfs.has(dirpath)) {
    dirAndPdfs.set(dirpath, [pdf])
  } else {
    dirAndPdfs.get(dirpath).push(pdf)
  }

  return (pipe, util) => {
    util.writableOn('finish', () => {
      pdf.finish = true
      const pdfs = dirAndPdfs.get(dirpath)
      return (
        pdfs.every(({ finish }) => finish) &&
        (0, _util.mergeout)({
          outdir: (0, _path.resolve)(dirpath),
          filepaths: pdfs.map(({ filepath }) => filepath).sort()
        })
      )
    })

    return pipe(
      new _inkscape2.default([
        '--export-pdf',
        '--export-area-drawing',
        '--export-width=1024'
      ])
    )
  }
}
