import esbuild from 'esbuild'
import { htmlPlugin } from '@craftamap/esbuild-plugin-html'
import { copy } from 'esbuild-plugin-copy'
import { JSDOM } from 'jsdom'
import { glob } from 'glob'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { createWriteStream } from 'fs'

function html2module(html) {
  let script = ''

  html = html.replace(/<script[\s\S]*?>([\s\S]*?)<\/script>/g, (_, content) => {
    script += content
    return ''
  })

  return `
    const __import_meta_document__ = new DOMParser().parseFromString(${JSON.stringify(html)}, 'text/html');
    ${script.replaceAll('import.meta.document', '__import_meta_document__')}
  `
}

async function packBin() {
  const paths = await glob('**/*.*', { cwd: './src/bin' })

  await mkdir('./dist')
  const ws = createWriteStream('./dist/data.bin')

  const files = []
  let offset = 0

  for (const path of paths) {
    const file = await readFile(`./src/bin/${path}`)
    ws.write(file)
    files.push([path, [offset, file.length]])
    offset += file.length
  }

  ws.end()
  return files
}

const binFiles = await packBin()

const dom = new JSDOM(await readFile('src/index.html'))
for (const el of dom.window.document.querySelectorAll('[data-prod-remove]')) {
  el.remove()
}
for (const el of dom.window.document.querySelectorAll('template[data-prod-expand]')) {
  el.replaceWith(el.content)
}

await esbuild.build({
  bundle: true,
  entryPoints: ['src/main.js'],
  minify: true,
  metafile: true,
  outdir: 'dist/',
  format: 'esm',
  plugins: [
    {
      name: 'bin-loader',
      async setup(build) {
        build.onLoad({ filter: /src[\/\\]lib[\/\\]bin\.js$/ }, async (args) => {
          const script = `
            const cache = {}
            {
              const files = ${JSON.stringify(binFiles)}
              const promise = fetch('./data.bin').then((res) => res.arrayBuffer())
              for (const [path, [offset, size]] of files) {
                cache[path] = promise.then((buf) => buf.slice(offset, offset + size))
              }
            }
            export default (path) => cache[path]
          `
          return { contents: script, loader: 'js' }
        })
      },
    },
    {
      name: 'html-modules',
      async setup(build) {
        build.onLoad({ filter: /\.m\.html$/ }, async (args) => {
          const html = await readFile(args.path, 'utf8')
          const script = html2module(html)
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
        { from: './src/sw.js', to: './' },
      ],
    }),
  ],
  alias: {
    '@': './src',
  },
})

const cacheFiles = await glob('**/*.*', { cwd: './dist', ignore: ['index.html', 'sw.js'] })
await writeFile('./dist/cache-files.json', JSON.stringify(cacheFiles))
