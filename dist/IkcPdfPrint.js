'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inkscape = require('inkscape');

var _inkscape2 = _interopRequireDefault(_inkscape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = opts => {
  opts.ext = '.pdf';
  return pipe => pipe(new _inkscape2.default(['--export-pdf', '--export-area-drawing', '--export-width=1024']));
};