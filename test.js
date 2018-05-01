import assert from 'assert'
import Inkscape from 'inkscape'
import { parse, extname } from 'path'
import o2a, { optionsAsRaw } from './src/o2a.js'
import { inkscape, inkscapePdfMerge } from './src'

describe('processor()', () => {
  const pipe = (stream) => stream
  const { root, dir, name, ext } = parse('./hoge/fuga.svg')
  const util = { out: { root, dir, name, ext } }

  const test = (format, expectExt) => () => {
    const { isStream, processor } = inkscape(format)
    const [ outpath, stream ] = processor(pipe, util)
    assert.equal(isStream, true)
    assert.equal(extname(outpath), expectExt || `.${format}`)
    assert.equal(stream.constructor, Inkscape)
  }

  it('png', test('png'))
  it('pdf', test('pdf'))
  it('ps', test('ps'))
  it('eps', test('eps'))
  it('plain', test('plain', '.svg'))

  it('inkscapePdfMerge', () => {
    const { ext: { isStream, processor }, dist } = inkscapePdfMerge()
    const [ outpath, stream ] = processor(pipe, util)
    assert.equal(isStream, true)
    assert.ok(typeof dist === 'function')
    assert.equal(extname(outpath), '.pdf')
    assert.equal(stream.constructor, Inkscape)
  })
})

describe('throws', () => {

  const test = (invalidFormat, regexp) => () =>
    assert.throws(() => inkscape(invalidFormat), regexp)

  it('!format', test(
    undefined,
    /chin-plugin-inkscape: require format as first argument./
  ))

  it('!formats.includes(format)', test(
    'pfd',
    /chin-plugin-inkscape: pfd is invalid format./
  ))

})

it('all options', () => {

  const optionsAsArr = o2a({
    export: {
      png: true,
      pdf: true,
      ps: true,
      eps: true,
      plainSvg: true,
      area: true,
      areaPage: true,
      areaDrawing: true,
      areaSnap: true,
      id: true,
      idOnly: true,
      useHints: true,
      background: true,
      backgroundOpacity: true,
      dpi: true,
      width: true,
      height: true,
      pdfVersion: true,
      latex: true,
      psLevel: true,
      textToPath: true,
      ignoreFilters: true
    },
    query: {
      id: true,
      x: true,
      y: true,
      width: true,
      height: true,
      all: true
    },
    print: true,
    extensionDirectory: true,
    verb: true,
    verbList: true,
    select: true,
    shell: true,
    withGui: true,
    withoutGui: true,
    vacuumDefs: true,
    noConvertTextBaselineSpacing: true,
    gFatalWarnings: true
  })

  assert.equal(optionsAsArr.length, optionsAsRaw.length)
  assert.ok(optionsAsArr.every(option => optionsAsRaw.includes(option)))
})