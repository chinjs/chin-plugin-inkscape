import paramCase from 'param-case'
import optionsAsRaw from './options.js'

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