import { inkscape, inkscapePdfMerge } from '../src'
import { join } from 'path'

const put = '.ex/put'
const out = '.ex/out'

const { ext, dist } = inkscapePdfMerge()

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
    ['merge', { svg: ext }]
  ],
  after: () =>
    dist(join(out, 'merged/hoge/fuga/index.pdf'), {
      sort: (filepaths) => filepaths,
      noCleanAfter: false
    })
}