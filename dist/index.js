'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var paramCase = _interopDefault(require('param-case'))
var Inkscape = _interopDefault(require('inkscape'))
var pdfMerge = _interopDefault(require('pdf-merge'))
var fsExtra = require('fs-extra')
var path = require('path')

var optionsAsRaw = [
  '--export-png',
  '--export-area',
  '--export-area-page',
  '--export-area-drawing',
  '--export-area-snap',
  '--export-id',
  '--export-id-only',
  '--export-use-hints',
  '--export-background',
  '--export-background-opacity',
  '--export-dpi',
  '--export-width',
  '--export-height',
  '--export-ps',
  '--export-eps',
  '--export-pdf',
  '--export-pdf-version',
  '--export-latex',
  '--export-ps-level',
  '--export-text-to-path',
  '--export-ignore-filters',
  '--export-plain-svg',
  '--print',
  '--query-id',
  '--query-x',
  '--query-y',
  '--query-width',
  '--query-height',
  '--query-all',
  '--extension-directory',
  '--verb-list',
  '--verb',
  '--select',
  '--shell',
  '--with-gui',
  '--without-gui',
  '--vacuum-defs',
  '--no-convert-text-baseline-spacing',
  '--g-fatal-warnings'
]

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var defineProperty = function(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    })
  } else {
    obj[key] = value
  }

  return obj
}

var slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = []
    var _n = true
    var _d = false
    var _e = undefined

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value)

        if (i && _arr.length === i) break
      }
    } catch (err) {
      _d = true
      _e = err
    } finally {
      try {
        if (!_n && _i['return']) _i['return']()
      } finally {
        if (_d) throw _e
      }
    }

    return _arr
  }

  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i)
    } else {
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance'
      )
    }
  }
})()

var o2a = function() {
  var options =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var optionsAsArray = []
  recursivePush(options, optionsAsArray)
  var invalids = optionsAsArray.filter(function(option) {
    return !optionsAsRaw.includes(option.split('=')[0])
  })
  return invalids.length ? throwInvalids(invalids) : optionsAsArray
}

var recursivePush = function recursivePush(options, array) {
  var prefix =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ''
  return Object.entries(options)
    .filter(function(_ref) {
      var _ref2 = slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1]

      return value
    })
    .forEach(function(_ref3) {
      var _ref4 = slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1]

      return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) ===
        'object' && !Array.isArray(value)
        ? recursivePush(value, array, prefix + key)
        : array.push(
            '--' +
              paramCase((prefix ? prefix + '-' : '') + key) +
              (typeof value === 'boolean' ? '' : '=' + value)
          )
    })
}

var throwInvalids = function throwInvalids(invalids) {
  throw new Error('detected invalid option: ' + invalids.join(','))
}

var fwa = function fwa(obj) {
  for (
    var _len = arguments.length,
      addition = Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    addition[_key - 1] = arguments[_key]
  }

  return path.format(Object.assign.apply(Object, [obj].concat(addition)))
}

var opts2options = function opts2options(type, opts) {
  var _Object$assign

  var _ref = opts || {},
    area = _ref.area,
    width = _ref.width,
    height = _ref.height,
    background = _ref.background,
    backgroundOpacity = _ref.backgroundOpacity,
    _ref$raw = _ref.raw,
    options = _ref$raw === undefined ? {} : _ref$raw

  options.export = Object.assign(
    {},
    options.export,
    ((_Object$assign = {}),
    defineProperty(_Object$assign, type, true),
    defineProperty(_Object$assign, 'width', width),
    defineProperty(_Object$assign, 'height', height),
    defineProperty(_Object$assign, 'background', background),
    defineProperty(_Object$assign, 'backgroundOpacity', backgroundOpacity),
    _Object$assign),
    !area
      ? false
      : area === 'page'
        ? { areaPage: true }
        : area === 'drawing'
          ? { areaDrawing: true }
          : area === 'snap'
            ? { areaSnap: true }
            : { area: area }
  )

  return options
}

var inkscape = function inkscape(options) {
  var optionsAsArray = o2a(options)
  var ext = optionsAsArray.includes('--export-png')
    ? '.png'
    : optionsAsArray.includes('--export-pdf')
      ? '.pdf'
      : optionsAsArray.includes('--export-ps')
        ? '.ps'
        : optionsAsArray.includes('--export-eps')
          ? '.eps'
          : optionsAsArray.includes('--export-plain-svg')
            ? '.svg'
            : '.svg'
  return {
    isStream: true,
    processor: function processor(pipe, _ref2) {
      var out = _ref2.out
      return [fwa(out, { ext: ext }), pipe(new Inkscape(optionsAsArray))]
    }
  }
}

var inkscapePng = function inkscapePng(opts) {
  return inkscape(opts2options('png', opts))
}

var inkscapePdf = function inkscapePdf(opts) {
  return inkscape(opts2options('pdf', opts))
}

var inkscapePs = function inkscapePs(opts) {
  return inkscape(opts2options('ps', opts))
}

var inkscapeEps = function inkscapeEps(opts) {
  return inkscape(opts2options('eps', opts))
}

var inkscapePlainSvg = function inkscapePlainSvg(opts) {
  return inkscape(opts2options('plainSvg', opts))
}

var inkscapePdfMerge = function inkscapePdfMerge(opts) {
  var filepaths = []
  var dirpaths = []

  var _inkscapePdf = inkscapePdf(opts),
    isStream = _inkscapePdf.isStream,
    pdfProcessor = _inkscapePdf.processor

  var processor = function processor(pipe, _ref3) {
    var out = _ref3.out

    var _pdfProcessor = pdfProcessor(pipe, { out: out }),
      _pdfProcessor2 = slicedToArray(_pdfProcessor, 2),
      outpath = _pdfProcessor2[0],
      stream = _pdfProcessor2[1]

    filepaths.push(outpath)
    dirpaths.push(out.dir)
    return [outpath, stream]
  }

  var dist = function dist(output) {
    var _ref4 =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      noCleanAfter = _ref4.noCleanAfter,
      sort = _ref4.sort

    return pdfMerge(typeof sort !== 'function' ? filepaths : sort(filepaths), {
      output: path.join('./', output)
    }).then(function() {
      return (
        !noCleanAfter &&
        Promise.resolve()
          .then(function() {
            return Promise.all(
              filepaths.map(function(filepath) {
                return fsExtra.remove(filepath)
              })
            )
          })
          .then(function() {
            return Promise.all(
              dirpaths.map(function(dirpath) {
                return fsExtra.readdir(dirpath).then(function(_ref5) {
                  var length = _ref5.length
                  return !length && fsExtra.remove(dirpath)
                })
              })
            )
          })
      )
    })
  }

  return { ext: { isStream: isStream, processor: processor }, dist: dist }
}

exports.inkscape = inkscape
exports.inkscapePng = inkscapePng
exports.inkscapePdf = inkscapePdf
exports.inkscapePs = inkscapePs
exports.inkscapeEps = inkscapeEps
exports.inkscapePlainSvg = inkscapePlainSvg
exports.inkscapePdfMerge = inkscapePdfMerge
exports.default = inkscape
