import Inkscape from 'inkscape'

export default opts => {
  opts.ext = '.png'
  return pipe =>
    pipe(
      new Inkscape([
        '--export-png',
        '--export-area-page',
        '--export-width=1024'
      ])
    )
}
