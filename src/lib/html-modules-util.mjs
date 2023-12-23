export function html2module(html, transform) {
  let script = ''

  html = html.replace(/<script[\s\S]*?>([\s\S]*?)<\/script>/g, (_, content) => {
    script += content
    return ''
  })

  if (transform) html = transform(html)

  return `
    const __import_meta_document__ = new DOMParser().parseFromString(${JSON.stringify(html)}, 'text/html');
    ${script.replaceAll('import.meta.document', '__import_meta_document__')}
  `
}
