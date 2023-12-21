export class CSSAnime {
  #animes
  #queue = []

  constructor(animes) {
    this.#animes = animes
  }

  load(el) {
    const animes = []
    for (const anime of el.getAnimations({ subtree: true })) {
      if (anime instanceof CSSAnimation) {
        if (anime.playState === 'paused') anime.cancel()
        animes.push(anime)
      }
    }
    this.#animes = animes
    for (const [fn, args] of this.#queue) fn.call(this, ...args)
    this.#queue = []
  }

  select(selector) {
    return new CSSAnime(this.#animes.filter((anime) => anime.effect?.target?.matches(selector)))
  }

  #get(...names) {
    if (!names.length) return this.#animes.slice()
    return this.#animes.filter((anime) => names.includes(anime.animationName))
  }

  play(...names) {
    if (!this.#animes) {
      this.#queue.push([this.play, [...arguments]])
      return
    }
    for (const anime of this.#get(...names)) {
      anime.cancel()
      anime.play()
    }
  }

  speed(playbackRate, ...names) {
    if (!this.#animes) {
      this.#queue.push([this.speed, [...arguments]])
      return
    }
    for (const anime of this.#get(...names)) {
      anime.playbackRate = playbackRate
    }
  }

  cancel(...names) {
    if (!this.#animes) {
      this.#queue.push([this.cancel, [...arguments]])
      return
    }
    for (const anime of this.#get(...names)) {
      anime.cancel()
    }
  }

  isRunning(...names) {
    return this.#get(...names).some((anime) => anime.playState === 'running')
  }

  isFinished(...names) {
    return this.#get(...names).every((anime) => anime.playState === 'finished')
  }
}
