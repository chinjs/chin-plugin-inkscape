import assert from 'assert'
import Inkscape from 'inkscape'
import { parse, extname } from 'path'
import o2a from './src/o2a.js'
import optionsAsRaw from './src/options.js'
import {
  inkscape,
  inkscapePng,
  inkscapePdf,
  inkscapePs,
  inkscapeEps,
  inkscapePlainSvg,
  inkscapePdfMerge
} from './src'

describe('inkscapeFormat', () => {
  const pipe = (stream) => stream
  const { root, dir, name, ext } = parse('./hoge/fuga.svg')
  const util = { out: { root, dir, name, ext } }

  const test = (plugin, expectExt) => () => {
    const { isStream, processor } = plugin()
    const [ outpath, stream ] = processor(pipe, util)
    assert.equal(isStream, true)
    assert.equal(extname(outpath), expectExt)
    assert.equal(stream.constructor, Inkscape)
  }

  it('inkscape', test(inkscape, '.svg'))
  it('inkscapePng', test(inkscapePng, '.png'))
  it('inkscapePdf', test(inkscapePdf, '.pdf'))
  it('inkscapePs', test(inkscapePs, '.ps'))
  it('inkscapeEps', test(inkscapeEps, '.eps'))
  it('inkscapePlainSvg', test(inkscapePlainSvg, '.svg'))

  it('inkscapePdfMerge', () => {
    const { ext: { isStream, processor }, dist } = inkscapePdfMerge()
    const [ outpath, stream ] = processor(pipe, util)
    assert.equal(isStream, true)
    assert.ok(typeof dist === 'function')
    assert.equal(extname(outpath), '.pdf')
    assert.equal(stream.constructor, Inkscape)
  })
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