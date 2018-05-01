import Inkscape from 'inkscape'
import pdfMerge from 'pdf-merge'
import { remove, readdir } from 'fs-extra'
import { format, join } from 'path'
import o2a from './o2a.js'

const fwa = (obj, ...addition) => format(Object.assign(obj, ...addition))

const opts2options = (type, opts) => {

  const {
    area,
    width,
    height,
    background,
    backgroundOpacity,
    raw: options = {}
  } = opts || {}

  options.export = Object.assign({}, options.export,
    { [type]: true, width, height, background, backgroundOpacity },
    !area ? false :
    area === 'page' ? { areaPage: true } :
    area === 'drawing' ? { areaDrawing: true } :
    area === 'snap' ? { areaSnap: true } :
    { area }
  )

  return options
}

export const inkscape = (options) => {
  const optionsAsArray = o2a(options)
  const ext = (
    optionsAsArray.includes('--export-png') ? '.png' :
    optionsAsArray.includes('--export-pdf') ? '.pdf' :
    optionsAsArray.includes('--export-ps') ? '.ps' :
    optionsAsArray.includes('--export-eps') ? '.eps' :
    optionsAsArray.includes('--export-plain-svg') ? '.svg' :
    '.svg'
  )
  return {
    isStream: true,
    processor: (pipe, { out }) => [fwa(out, { ext }), pipe(new Inkscape(optionsAsArray))]
  }
}

export const inkscapePng = (opts) => inkscape(opts2options('png', opts))

export const inkscapePdf = (opts) => inkscape(opts2options('pdf', opts))

export const inkscapePs = (opts) => inkscape(opts2options('ps', opts))

export const inkscapeEps = (opts) => inkscape(opts2options('eps', opts))

export const inkscapePlainSvg = (opts) => inkscape(opts2options('plainSvg', opts))

export const inkscapePdfMerge = (opts) => {
  const filepaths = []
  const dirpaths = []
  const { isStream, processor: pdfProcessor } = inkscapePdf(opts)

  const processor = (pipe, { out }) => {
    const [outpath, stream] = pdfProcessor(pipe, { out })
    filepaths.push(outpath)
    dirpaths.push(out.dir)
    return [outpath, stream]
  }

  const dist = (output, { noCleanAfter, sort } = {}) =>
    pdfMerge(
      (typeof sort !== 'function'
        ? filepaths
        : sort(filepaths)
      ),
      { output: join('./', output) }
    )
    .then(() =>
      !noCleanAfter &&
      Promise.resolve()
      .then(() =>
        Promise.all(filepaths.map(filepath =>
          remove(filepath)
        ))
      )
      .then(() =>
        Promise.all(dirpaths.map(dirpath =>
          readdir(dirpath)
          .then(({ length }) =>
            !length &&
            remove(dirpath)
          )
        ))
      )
    )

  return { ext: { isStream, processor }, dist }
}

export default inkscape