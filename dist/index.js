'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _InkPdf = require('./InkPdf.js')

var _InkPdf2 = _interopRequireDefault(_InkPdf)

var _InkPdfMerge = require('./InkPdfMerge.js')

var _InkPdfMerge2 = _interopRequireDefault(_InkPdfMerge)

var _InkPdfMergePrint = require('./InkPdfMergePrint.js')

var _InkPdfMergePrint2 = _interopRequireDefault(_InkPdfMergePrint)

var _InkPdfPrint = require('./InkPdfPrint.js')

var _InkPdfPrint2 = _interopRequireDefault(_InkPdfPrint)

var _InkPng = require('./InkPng.js')

var _InkPng2 = _interopRequireDefault(_InkPng)

var _InkPngWhite = require('./InkPngWhite.js')

var _InkPngWhite2 = _interopRequireDefault(_InkPngWhite)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

exports.default = () => ({
  InkPdf: _InkPdf2.default,
  InkPdfMerge: _InkPdfMerge2.default,
  InkPdfMergePrint: _InkPdfMergePrint2.default,
  InkPdfPrint: _InkPdfPrint2.default,
  InkPng: _InkPng2.default,
  InkPngWhite: _InkPngWhite2.default
})
