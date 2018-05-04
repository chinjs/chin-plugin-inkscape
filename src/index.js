import Inkscape from 'inkscape'
import pdfMerge from 'pdf-merge'
import { outputFile, remove, readdir } from 'fs-extra'
import { format, join, dirname } from 'path'
import o2a from './o2a.js'

const formats = ['png', 'pdf', 'ps', 'eps', 'plain']

const asserts = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const s2a = (set) => [...set.values()]

const fwa = (obj, ...addition) => format(Object.assign({}, obj, ...addition))

const o2o = (f, opts) => {

  const {
    area,
    dpi,
    width,
    height,
    background,
    backgroundOpacity,
    config: options = {}
  } = opts || {}

  options.export = Object.assign(
    {
      [f]: true,
      dpi,
      width,
      height,
      background,
      backgroundOpacity
    },
    (
      !area ? false :
      area === 'page' ? { areaPage: true } :
      area === 'drawing' ? { areaDrawing: true } :
      area === 'snap' ? { areaSnap: true } :
      { area }
    ),
    options.export
  )

  return options
}

export const inkscape = (format, opts) => {

  asserts(format, `chin-plugin-inkscape: require format as first argument.`)
  asserts(formats.includes(format), `chin-plugin-inkscape: ${format} is invalid format.`)

  const [f, ext] = format === 'plain' ? ['plainSvg', '.svg'] : [format, `.${format}`]

  const optionsAsArray = o2a(o2o(f, opts))

  const processor = (pipe, { out }) => [fwa(out, { ext }), pipe(new Inkscape(optionsAsArray))]

  return { isStream: true, processor }
}

export const inkscapeMergePdfs = (opts) => {

  const filepathsSet = new Set()
  const dirpathsSet = new Set()

  const { isStream, processor: pdfProcessor } = inkscape('pdf', opts)

  const processor = (...arg) => {
    const [outpath, stream] = pdfProcessor(...arg)
    !filepathsSet.has(outpath) && filepathsSet.add(outpath)

    const dirpath = dirname(outpath)
    !dirpathsSet.has(dirpath) && dirpathsSet.add(dirpath)

    return [outpath, stream]
  }

  const after = (output, { noCleanAfter, sort } = {}) => {

    const filepaths = s2a(filepathsSet)

    return pdfMerge(
      typeof sort !== 'function'
      ? filepaths
      : sort(filepaths)
    )
    .then(buffer =>
      outputFile(join('./', output), buffer)
    )
    .then(() =>
      !noCleanAfter &&
      Promise.resolve()
      .then(() =>
        Promise.all(filepaths.map(filepath => remove(filepath)))
      )
      .then(() =>
        Promise.all(s2a(dirpathsSet).map(dirpath => rcrRemoveDir(dirpath)))
      )
    )
  }

  return { isStream, processor, after }
}

const rcrRemoveDir = (dirpath) =>
  readdir(dirpath).then(({ length }) =>
    !length &&
    remove(dirpath).then(() =>
      rcrRemoveDir(dirname(dirpath))
    )
  )

export default inkscape