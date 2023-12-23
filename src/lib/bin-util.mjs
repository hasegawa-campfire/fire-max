import { glob } from 'glob'
import { readFile, mkdir } from 'fs/promises'
import { createWriteStream } from 'fs'
import { dirname } from 'path'

export async function packBin(src = './src/bin', out = './dist/data.bin') {
  const paths = await glob('**/*.*', { cwd: src })

  await mkdir(dirname(out), { recursive: true })
  const ws = createWriteStream(out)

  const files = []
  let offset = 0

  for (const path of paths) {
    const file = await readFile(`${src}/${path}`)
    ws.write(file)
    files.push([path, [offset, file.length]])
    offset += file.length
  }

  ws.end()
  return files
}
