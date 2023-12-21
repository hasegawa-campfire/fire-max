const AudioContext = window.AudioContext || window.webkitAudioContext

const userActionEvents = [
  'keydown',
  'keyup',
  'keypress',
  'touchstart',
  'touchend',
  'touchcancel',
  'mousedown',
  'mouseup',
  'contextmenu',
  'click',
  'pointerdown',
  'pointerup',
  'pointercancel',
]

const masterPromise = new Promise((resolve) => {
  let ctx = null
  let gain = null

  const setup = async () => {
    if (!ctx) {
      ctx = new AudioContext()
      await ctx.resume()
    }

    if (!gain) {
      gain = ctx.createGain()
      gain.gain.setValueAtTime(0, 0)
      gain.connect(ctx.destination)
    }

    resolve({ ctx, gain })
  }

  userActionEvents.map((type) => {
    document.addEventListener(type, setup, { once: true })
  })
})

export function setAudioVolume(value) {
  masterPromise.then(({ ctx, gain }) => {
    gain.gain.linearRampToValueAtTime(value, ctx.currentTime + 0.05)
  })
}

export class Audio {
  #baseVolume
  #volume = 1
  #minTime
  #delay
  #loop
  #mute = false
  #startTime = Number.MIN_SAFE_INTEGER
  #audioBufferPromise
  #gainNodePromise
  #audioSource = null
  #playing = false

  constructor(arrayBuffer, param) {
    param = param ?? {}
    this.#baseVolume = param.volume ?? 1
    this.#minTime = param.minTime ?? 0
    this.#delay = param.delay ?? 0
    this.#loop = param.loop ?? false

    this.#audioBufferPromise = masterPromise.then(async (master) => {
      const audioBuffer = await arrayBuffer
      return master.ctx.decodeAudioData(audioBuffer)
    })

    this.#gainNodePromise = masterPromise.then(async (master) => {
      const gainNode = master.ctx.createGain()
      gainNode.gain.value = 0
      gainNode.connect(master.gain)
      return gainNode
    })
  }

  get playing() {
    return this.#playing
  }

  async play(delay = 0, volume = 1) {
    this.#playing = true
    const playTime = Date.now()

    const { ctx } = await masterPromise
    const audioBuffer = await this.#audioBufferPromise
    const gainNode = await this.#gainNodePromise

    if (!this.#playing) return

    const lagTime = (Date.now() - playTime) / 1000
    delay = delay + this.#delay - (lagTime < 0.05 ? 0 : lagTime)

    const startTime = ctx.currentTime + delay
    if (startTime - this.#startTime < this.#minTime) return

    const audioSource = ctx.createBufferSource()

    this.#audioSource?.stop(Math.max(startTime, 0))
    this.#audioSource = audioSource
    this.#startTime = startTime

    if (typeof this.#loop === 'boolean') {
      audioSource.loop = this.#loop
    } else {
      audioSource.loop = true
      audioSource.loopStart = this.#loop.start ?? 0
      audioSource.loopEnd = this.#loop.end ?? 0
    }

    audioSource.buffer = audioBuffer
    audioSource.connect(gainNode)

    this.#volume = volume

    if (delay < 0) {
      audioSource.start(Math.max(startTime, 0), -delay)
      gainNode.gain.linearRampToValueAtTime(this.#getVolume(), ctx.currentTime + 0.05)
    } else {
      audioSource.start(startTime)
      gainNode.gain.setValueAtTime(this.#getVolume(), startTime)
    }
  }

  async stop(delay = 0) {
    const { ctx } = await masterPromise

    this.#playing = false
    this.#audioSource?.stop(ctx.currentTime + delay)
    this.#audioSource = null
  }

  setMute(value) {
    this.#mute = value
    this.#updateVolume()
  }

  setVolume(value, time = 0) {
    this.#volume = value
    this.#updateVolume(time)
  }

  async #updateVolume(time = 0) {
    const { ctx } = await masterPromise
    const gainNode = await this.#gainNodePromise

    gainNode.gain.cancelScheduledValues(ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(this.#getVolume(), ctx.currentTime + time)
  }

  #getVolume() {
    return this.#mute ? 0 : this.#volume * this.#baseVolume
  }
}
