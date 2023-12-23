const cache = {}

{
  const files = BIN_FILES
  const promise = fetch('./data.bin').then((res) => res.arrayBuffer())
  for (const [path, [offset, size]] of files) {
    cache[path] = promise.then((buf) => buf.slice(offset, offset + size))
  }
}

export default (path) => cache[path]
