'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.mergeout = undefined

var _pdfMerge = require('pdf-merge')

var _pdfMerge2 = _interopRequireDefault(_pdfMerge)

var _fsExtra = require('fs-extra')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

const mergeout = (exports.mergeout = ({ outdir, filepaths }) =>
  (0, _pdfMerge2.default)(filepaths, { output: `${outdir}.pdf` })
    .then(() => (0, _fsExtra.remove)(outdir))
    .catch(err => {
      throw err
    }))
