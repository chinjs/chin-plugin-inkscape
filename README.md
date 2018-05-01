# chin-plugin-inkscape

[![npm](https://img.shields.io/npm/v/chin-plugin-inkscape.svg?style=flat-square)](https://www.npmjs.com/package/chin-plugin-inkscape)
[![npm](https://img.shields.io/npm/dm/chin-plugin-inkscape.svg?style=flat-square)](https://www.npmjs.com/package/chin-plugin-inkscape)
[![Build Status](https://img.shields.io/travis/kthjm/chin-plugin-inkscape.svg?style=flat-square)](https://travis-ci.org/kthjm/chin-plugin-inkscape)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/chin-plugin-inkscape.svg?style=flat-square)](https://codecov.io/github/kthjm/chin-plugin-inkscape)

## Installation
```shell
yarn add -D chin-plugin-inkscape
```

## Usage

### inkscape([options])
options is [inkscape options](https://inkscape.org/en/doc/inkscape-man.html) as object. `export` and `query` is set as object, and all properties are set as camelCase.
```js
import inkscape from 'chin-plugin-inkscape'

const ext = inkscape({
  export: { backgroundOpacity: 0.5 }, // => '--export-background-opacity=0.5'
  query: { id: 'unique_id' },         // => '--query-id=unique_id'
  noConvertTextBaselineSpacing: true  // => '--no-convert-text-baseline-spacing'
})
```

### inkscapeFormat([options])

Using them set to `--export-[format]`.

```js
import {
  inkscapePng,
  inkscapePdf,
  inkscapePs,
  inkscapeEps,
  inkscapePlainSvg
} from 'chin-plugin-inkscape'

const ext = inkscapePng({
  area: 'page',
  width: 1024,
  background: '#ffffff',
  raw: { export: {}, query: {} }
})
```
#### Options
- area: `'page'` | `'drawing'` | `'snap'` | `'x0:y0:x1:y1'`
- width
- height
- background
- backgroundOpacity
- raw: `inkscape()` options (for custom)

### inkscapePdfMerge(outpath[, options])

merge pdf files after process. depending on [pdf-merge](https://github.com/wubzz/pdf-merge) (depend on [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/)).

```js
import { inkscapePdfMerge } from 'chin-plugin-inkscape'

const { ext, dist } = inkscapePdfMerge( /*same inkscapePdf*/ )

export default {
  put: 'put',
  out: 'out',
  processors: { svg: ext },
  after() => dist('out/merge.pdf')
}
```

#### Options
- noCleanAfter: `boolean`
- sort: `(filepath[]) => filepath[]`

## License
MIT (http://opensource.org/licenses/MIT)
