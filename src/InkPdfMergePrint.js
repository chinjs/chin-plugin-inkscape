import Inkscape from 'inkscape'
import { normalize, format, resolve } from 'path'
import { mergeout } from './util.js'

const dirAndPdfs = new Map()

export default opts => {
  opts.ext = '.pdf'

  const dirpath = normalize(opts.dir)
  const pdf = { filepath: resolve(format(opts)), finish: false }

  if (!dirAndPdfs.has(dirpath)) {
    dirAndPdfs.set(dirpath, [pdf])
  } else {
    dirAndPdfs.get(dirpath).push(pdf)
  }

  return (pipe, util) => {
    util.writableOn('finish', () => {
      pdf.finish = true
      const pdfs = dirAndPdfs.get(dirpath)
      return (
        pdfs.every(({ finish }) => finish) &&
        mergeout({
          outdir: resolve(dirpath),
          filepaths: pdfs.map(({ filepath }) => filepath).sort()
        })
      )
    })

    return pipe(
      new Inkscape([
        '--export-pdf',
        '--export-area-drawing',
        '--export-width=1024'
      ])
    )
  }
}
