import { inkscape, inkscapeMergePdfs } from '../src'
import { join } from 'path'

const put = join(__dirname, 'put')
const out = join(__dirname, 'out')

const mergeExt = inkscapeMergePdfs()

export default {
  put,
  out,
  clean: true,
  processors: [
    ['ps', { svg: inkscape('ps') }],
    ['eps', { svg: inkscape('eps') }],
    ['png', { svg: inkscape('png', { background: '#493847' }) }],
    ['pdf', { svg: inkscape('pdf') }],
    ['plain', { svg: inkscape('plain') }],
    ['merge', { svg: mergeExt }]
  ],
  after: () =>
    mergeExt.after(
      join(out, 'merged/hoge/fuga/index.pdf'),
      {
        sort: (filepaths) => filepaths,
        noCleanAfter: false
      }
    )
}