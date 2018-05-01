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

var toConsumableArray = function(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i]

    return arr2
  } else {
    return Array.from(arr)
  }
}

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

var formats = ['png', 'pdf', 'ps', 'eps', 'plain']

var asserts = function asserts(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

var s2a = function s2a(set$$1) {
  return [].concat(toConsumableArray(set$$1.values()))
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

  return path.format(Object.assign.apply(Object, [{}, obj].concat(addition)))
}

var o2o = function o2o(f, opts) {
  var _Object$assign

  var _ref = opts || {},
    area = _ref.area,
    dpi = _ref.dpi,
    width = _ref.width,
    height = _ref.height,
    background = _ref.background,
    backgroundOpacity = _ref.backgroundOpacity,
    _ref$config = _ref.config,
    options = _ref$config === undefined ? {} : _ref$config

  options.export = Object.assign(
    ((_Object$assign = {}),
    defineProperty(_Object$assign, f, true),
    defineProperty(_Object$assign, 'dpi', dpi),
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
            : { area: area },
    options.export
  )

  return options
}

var inkscape = function inkscape(format, opts) {
  asserts(format, 'chin-plugin-inkscape: require format as first argument.')
  asserts(
    formats.includes(format),
    'chin-plugin-inkscape: ' + format + ' is invalid format.'
  )

  var _ref2 =
      format === 'plain' ? ['plainSvg', '.svg'] : [format, '.' + format],
    _ref3 = slicedToArray(_ref2, 2),
    f = _ref3[0],
    ext = _ref3[1]

  var optionsAsArray = o2a(o2o(f, opts))

  var processor = function processor(pipe, _ref4) {
    var out = _ref4.out
    return [fwa(out, { ext: ext }), pipe(new Inkscape(optionsAsArray))]
  }

  return { isStream: true, processor: processor }
}

var inkscapePdfMerge = function inkscapePdfMerge(opts) {
  var filepathsSet = new Set()
  var dirpathsSet = new Set()

  var _inkscape = inkscape('pdf', opts),
    isStream = _inkscape.isStream,
    pdfProcessor = _inkscape.processor

  var processor = function processor() {
    var _pdfProcessor = pdfProcessor.apply(undefined, arguments),
      _pdfProcessor2 = slicedToArray(_pdfProcessor, 2),
      outpath = _pdfProcessor2[0],
      stream = _pdfProcessor2[1]

    !filepathsSet.has(outpath) && filepathsSet.add(outpath)

    var dirpath = path.dirname(outpath)
    !dirpathsSet.has(dirpath) && dirpathsSet.add(dirpath)

    return [outpath, stream]
  }

  var dist = function dist(output) {
    var _ref5 =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      noCleanAfter = _ref5.noCleanAfter,
      sort = _ref5.sort

    var filepaths = s2a(filepathsSet)

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
              s2a(dirpathsSet).map(function(dirpath) {
                return rcrRemoveDir(dirpath)
              })
            )
          })
      )
    })
  }

  return { ext: { isStream: isStream, processor: processor }, dist: dist }
}

var rcrRemoveDir = function rcrRemoveDir(dirpath) {
  return fsExtra.readdir(dirpath).then(function(_ref6) {
    var length = _ref6.length
    return (
      !length &&
      fsExtra.remove(dirpath).then(function() {
        return rcrRemoveDir(path.dirname(dirpath))
      })
    )
  })
}

exports.inkscape = inkscape
exports.inkscapePdfMerge = inkscapePdfMerge
exports.default = inkscape
