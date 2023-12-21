export class CSSProp {
  #el
  #name
  #value
  // #anime

  constructor(el, name) {
    this.#el = el
    this.#name = name
  }

  set value(value) {
    if (this.#value !== value) {
      this.#value = value
      this.#el.style.setProperty(this.#name, value)
      // this.#anime?.cancel()
      // this.#anime = this.#el.animate({ [this.#name]: value }, { duration: 0, easing: 'step-start', fill: 'forwards' })
    }
  }

  get value() {
    return this.#value
  }
}

export function setCSSProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    el.style.setProperty(key, value)
  }
  // el.animate(props, { duration: 0, easing: 'step-start', fill: 'forwards' })
}
