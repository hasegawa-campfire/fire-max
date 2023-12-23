import esbuild from 'esbuild'
import { htmlPlugin } from '@craftamap/esbuild-plugin-html'
import { copy } from 'esbuild-plugin-copy'
import { JSDOM } from 'jsdom'
import { glob } from 'glob'
import { readFile, writeFile } from 'fs/promises'
import { minify } from 'html-minifier'
import { packBin } from './src/lib/bin-util.mjs'
import { html2module } from './src/lib/html-module.mjs'

const dom = new JSDOM(await readFile('src/index.html'))
for (const el of dom.window.document.querySelectorAll('[data-prod-remove]')) {
  el.remove()
}
for (const el of dom.window.document.querySelectorAll('template[data-prod-expand]')) {
  el.replaceWith(el.content)
}

await esbuild.build({
  bundle: true,
  entryPoints: ['src/main.js', 'src/sw.js'],
  minify: true,
  metafile: true,
  outdir: 'dist/',
  format: 'esm',
  define: {
    BIN_FILES: JSON.stringify(await packBin()),
  },
  plugins: [
    {
      name: 'html-modules',
      async setup(build) {
        build.onLoad({ filter: /\.m\.html$/ }, async (args) => {
          const html = await readFile(args.path, 'utf8')
          const script = html2module(html, (html) => minify(html, { minifyCSS: true, collapseWhitespace: true }))
          return { contents: script, loader: 'js' }
        })
      },
    },
    htmlPlugin({
      files: [
        {
          entryPoints: ['src/main.js'],
          filename: 'index.html',
          htmlTemplate: dom.serialize(),
          scriptLoading: 'module',
        },
      ],
    }),
    copy({
      assets: [
        { from: './src/assets/*', to: './assets' },
        { from: './src/manifest.json', to: './' },
      ],
    }),
  ],
  alias: {
    '@': './src',
    'package.json': './package.json',
  },
})

const cacheFiles = await glob('**/*.*', { cwd: './dist', ignore: ['index.html', 'sw.js'] })
await writeFile('./dist/cache-files.json', JSON.stringify(cacheFiles))
