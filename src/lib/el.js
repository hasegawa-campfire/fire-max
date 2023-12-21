export function defineElement(tagName, ctor) {
  const clazz = class extends HTMLElement {
    constructor() {
      super()
      ctor(this)
    }
  }
  customElements.define(tagName, clazz)
  return clazz
}

export function renderRoot(el, doc) {
  if (!doc._content) {
    doc._content = doc.querySelector('template').content
  }

  if (!doc._sheets && 'adoptedStyleSheets' in document) {
    doc._sheets = Array.from(doc._content.querySelectorAll('style')).map((el) => {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(el.textContent)
      el.remove()
      return sheet
    })
  }

  const root = el.shadowRoot || el.attachShadow({ mode: 'open' })
  if (doc._content.children.length) root.append(document.importNode(doc._content, true))
  if (doc._sheets) root.adoptedStyleSheets = [...doc._sheets]

  return root
}
