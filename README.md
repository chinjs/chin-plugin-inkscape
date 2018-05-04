# chin-plugin-inkscape

[![npm](https://img.shields.io/npm/v/chin-plugin-inkscape.svg?style=flat-square)](https://www.npmjs.com/package/chin-plugin-inkscape)
[![npm](https://img.shields.io/npm/dm/chin-plugin-inkscape.svg?style=flat-square)](https://www.npmjs.com/package/chin-plugin-inkscape)
[![Build Status](https://img.shields.io/travis/kthjm/chin-plugin-inkscape.svg?style=flat-square)](https://travis-ci.org/kthjm/chin-plugin-inkscape)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/chin-plugin-inkscape.svg?style=flat-square)](https://codecov.io/github/kthjm/chin-plugin-inkscape)

[chin](https://github.com/kthjm/chin) plugin that operate Inkscape (and PDFtk).

## Installation
```shell
yarn add -D chin chin-plugin-inkscape
```

## Usage

ref: [inkscape options](https://inkscape.org/en/doc/inkscape-man.html)

### inkscape(format[, options])
```js
import inkscape from 'chin-plugin-inkscape'

const ext = inkscape('png', {
  area,
  dpi,
  width,
  height,
  background,
  backgroundOpacity,

  /* detail setting */
  config: {
    export: { [camelProperty] },
    query: { [camelProperty] },
    [camelProperty]
  }
})
```

#### format
|value|as|
|:-|:-|
|`'png'`  |`--export-png`|
|`'pdf'`  |`--export-pdf`|
|`'ps'`   |`--export-ps`|
|`'eps'`  |`--export-eps`|
|`'plain'`|`--export-plain-svg`|

#### area
|value|as|
|:-|:-|
|`'page'` [default]|`--export-area-page`|
|`'drawing'`       |`--export-area-drawing`|
|`'snap'`          |`--export-area-snap`|
|`'x0:y0:x1:y1'`   |`--export-area=x0:y0:x1:y1`|

#### options

- `dpi` [default: 96]

- `width/height` overrides the `dpi` setting

- `background/backgroundOpacity`

#### config
For detail setting that must have all properties as camelCase. Setting `true` as value means just pass. Properties that belongs to `export` and `query` are passed as `--export-[property]` and `--query-[property]`.

### inkscapeMergePdfs([options])

Merge pdf files after process. depending on [pdf-merge](https://github.com/wubzz/pdf-merge) (using [PDFtk](https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/)).

`options` is same to above (no need `format`).

```js
import { inkscapeMergePdfs } from 'chin-plugin-inkscape'

const ext = inkscapeMergePdfs()

export default {
  put: 'put',
  out: 'out',
  processors: { svg: ext },
  after() =>
    ext.after(
      'out/merge.pdf',
      { sort: (filepaths) => filepaths.sort() }
    )
}
```

#### ext.after(outpath[, options])

Write file that pdfs merged.

- `sort` function for sort that pass filepaths

- `noCleanAfter` prevent cleaning [default: false]

## License
MIT (http://opensource.org/licenses/MIT)
