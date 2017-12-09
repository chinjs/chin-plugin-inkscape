import Inkscape from 'inkscape'

export default opts => {
  opts.ext = '.pdf'
  return pipe =>
    pipe(
      new Inkscape([
        '--export-pdf',
        `--export-area-page`,
        '--export-width=1024'
      ])
    )
}
