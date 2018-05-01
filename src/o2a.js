import paramCase from 'param-case'

export default (options = {}) => {
  const optionsAsArray = []
  recursivePush(options, optionsAsArray)
  const invalids = optionsAsArray.filter(option => !optionsAsRaw.includes(option.split('=')[0]))
  return invalids.length ? throwInvalids(invalids) : optionsAsArray
}

const recursivePush = (options, array, prefix = '') =>
  Object
  .entries(options)
  .filter(([key,value]) => value)
  .forEach(([key,value]) =>
    typeof value === 'object' && !Array.isArray(value)
      ? recursivePush(value, array, prefix + key)
      : array.push(
        '--' +
        paramCase((prefix ? `${prefix}-` : '') + key) +
        (typeof value === 'boolean' ? '' : `=${value}`)
      )
  )

const throwInvalids = (invalids) => {
  throw new Error(
    'detected invalid option: ' +
    invalids.join(',')
  )
}

export const optionsAsRaw = [
  '--export-png',
  '--export-area',
  '--export-area-page',
  '--export-area-drawing',
  '--export-area-snap',
  '--export-id',
  '--export-id-only',
  '--export-use-hints',
  '--export-background',
  '--export-background-opacity',
  '--export-dpi',
  '--export-width',
  '--export-height',
  '--export-ps',
  '--export-eps',
  '--export-pdf',
  '--export-pdf-version',
  '--export-latex',
  '--export-ps-level',
  '--export-text-to-path',
  '--export-ignore-filters',
  '--export-plain-svg',
  '--print',
  '--query-id',
  '--query-x',
  '--query-y',
  '--query-width',
  '--query-height',
  '--query-all',
  '--extension-directory',
  '--verb-list',
  '--verb',
  '--select',
  '--shell',
  '--with-gui',
  '--without-gui',
  '--vacuum-defs',
  '--no-convert-text-baseline-spacing',
  '--g-fatal-warnings'
]