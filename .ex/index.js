const { inkscape, inkscapePdfMerge } = require('..')
const { join } = require('path')

const put = '.ex/put'
const out = '.ex/out'

const { ext, dist } = inkscapePdfMerge()

module.exports = {
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
    dist(join(out, 'merged.pdf'), {
      sort: (filepaths) => filepaths,
      noCleanAfter: false
    })
}