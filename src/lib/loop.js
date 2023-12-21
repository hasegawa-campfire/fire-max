export class Loop {
  #fps
  #callbacks = /** @type {(() => void)[]} */ ([])
  #prevTime = 0
  #timer = 0

  constructor(fps = 60) {
    this.#fps = fps
  }

  /**
   * @param {()=>void} callback
   */
  on(callback) {
    this.#callbacks.push(callback)
  }

  get fps() {
    return this.#fps
  }

  get frameTime() {
    return 1000 / this.#fps
  }

  get active() {
    return !!this.#timer
  }

  set active(value) {
    if (this.#timer && !value) {
      window.cancelAnimationFrame(this.#timer)
      this.#timer = 0
    } else if (!this.#timer && value) {
      this.#timer = window.requestAnimationFrame(this.#update)
    }
  }

  #update = () => {
    this.#timer = window.requestAnimationFrame(this.#update)

    const time = Date.now()
    if (time - this.#prevTime < this.frameTime * 0.8) return
    this.#prevTime = time

    for (const callback of this.#callbacks) callback()
  }
}
