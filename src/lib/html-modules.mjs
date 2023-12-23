import { readFile } from 'fs/promises'
import { minify } from 'html-minifier'
import { html2module } from './html-modules-util.mjs'

export default () => {
  return {
    name: 'html-modules',
    async setup(build) {
      build.onLoad({ filter: /\.m\.html$/ }, async (args) => {
        const html = await readFile(args.path, 'utf8')

        const script = html2module(html, (html) => {
          return minify(html, {
            minifyCSS: {
              compatibility: {
                properties: {
                  zeroUnits: false,
                },
              },
            },
            ollapseWhitespace: true,
          })
        })

        return { contents: script, loader: 'js' }
      })
    },
  }
}
