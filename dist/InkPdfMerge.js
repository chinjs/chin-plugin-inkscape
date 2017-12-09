'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inkscape = require('inkscape');

var _inkscape2 = _interopRequireDefault(_inkscape);

var _pdfMerge = require('pdf-merge');

var _pdfMerge2 = _interopRequireDefault(_pdfMerge);

var _fsExtra = require('fs-extra');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dirAndPdfs = new Map();

exports.default = opts => {
  opts.ext = '.pdf';

  const dirpath = (0, _path.normalize)(opts.dir);
  const pdf = { filepath: (0, _path.resolve)((0, _path.format)(opts)), finish: false };

  if (!dirAndPdfs.has(dirpath)) {
    dirAndPdfs.set(dirpath, [pdf]);
  } else {
    dirAndPdfs.get(dirpath).push(pdf);
  }

  return (pipe, util) => {
    util.writableOn('finish', () => {
      pdf.finish = true;

      const pdfs = dirAndPdfs.get(dirpath);
      return pdfs.every(({ finish }) => finish) && mergeout({
        outdir: (0, _path.resolve)(dirpath),
        filepaths: pdfs.map(({ filepath }) => filepath).sort()
      });
    });

    return pipe(new _inkscape2.default(['--export-pdf', `--export-area-page`, '--export-width=1024']));
  };
};

const mergeout = ({ outdir, filepaths }) => (0, _pdfMerge2.default)(filepaths, { output: `${outdir}.pdf` }).then(() => (0, _fsExtra.remove)(outdir)).catch(err => {
  throw err;
});