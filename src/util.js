import pdfMerge from 'pdf-merge'
import { remove } from 'fs-extra'

export const mergeout = ({ outdir, filepaths }) =>
  pdfMerge(filepaths, { output: `${outdir}.pdf` })
    .then(() => remove(outdir))
    .catch(err => {
      throw err
    })
