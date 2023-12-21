export class ActiveState {
  #callbacks = /** @type {((state: boolean) => void)[]} */ ([])
  #state = false

  constructor() {
    this.#state = this.isActive
    document.addEventListener('visibilitychange', this.#onChange)
    window.addEventListener('blur', this.#onChange)
    window.addEventListener('focus', this.#onChange)
  }

  get isActive() {
    return document.visibilityState === 'visible' && document.hasFocus()
  }

  #onChange = () => {
    const state = this.isActive
    if (this.#state !== state) {
      this.#state = state
      for (const callback of this.#callbacks) callback(state)
    }
  }

  /**
   * @param {(state:boolean)=>void} callback
   */
  on(callback) {
    this.#callbacks.push(callback)
    callback(this.isActive)
  }
}
