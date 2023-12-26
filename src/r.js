import { Loop } from '@/lib/loop.js'
import { Random } from '@/lib/random.js'
import { ActiveState } from '@/lib/active-state.js'
import { Audio } from '@/lib/audio.js'
import bin from '@/lib/bin.js'

export const activeState = new ActiveState()
export const loop = new Loop(20)
export const random = new Random()

export const store = {
  updatable: false,
  scene: 'title', // new URL(location).searchParams.get('scene') || 'title',
  leaveSpeed: 1,
  hiScore: 0,
  seed: 0,
  replay: null,
  playPhase: '',
  time: 0,
  score: 0,
  hits: [0, 0, 0, 0],
  laps: 0,
  rank: 0,
  rankExp: 0,
  get isFever() {
    return this.rank >= 3
  },
  feverTime: 0,
  feverTimeMax: 0,
  chain: 0,
  chainSteps: [],
  chainEffect: [],
  effects: [],
}

export const bgm = {
  volume: 0.5,
  title: new Audio(bin('audiostock_52242.mp3'), {
    loop: {
      start: 0, // 6.621, 19.862
      end: 33.1,
    },
  }),
  tips: new Audio(bin('audiostock_52242_intro.mp3'), {
    volume: 0.5,
    loop: true,
  }),
  play: new Audio(bin('audiostock_51584.mp3'), {
    volume: 0.5,
    loop: {
      start: 12.325,
      end: 63.553,
    },
  }),
  fever: new Audio(bin('audiostock_45719.mp3'), {
    volume: 0.5,
    loop: {
      start: 0.176,
      end: 5.754,
    },
  }),
  result: new Audio(bin('audiostock_52259.mp3'), {
    volume: 0.5,
    loop: {
      start: 15.424,
      end: 42.854,
    },
  }),
}

export const se = {
  gameStart: new Audio(bin('game-start.mp3'), { volume: 0.5 }),
  buttonDown: new Audio(bin('button-down.mp3'), { volume: 0.5 }),
  ready: new Audio(bin('ready.mp3'), { volume: 0.6 }),
  readyCount: new Audio(bin('ready-count.mp3'), { volume: 0.4 }),
  go: new Audio(bin('go.mp3'), { volume: 0.3 }),
  takibiShow: new Audio(bin('takibi-show.mp3'), { volume: 0.4 }),
  takibiShowBad: new Audio(bin('takibi-show-bad.mp3'), { volue: 0.8 }),
  takibiHide: new Audio(bin('takibi-hide.mp3'), { volume: 0.4 }),
  hit1: new Audio(bin('hit1.mp3'), {}),
  hit2: new Audio(bin('hit2.mp3'), {}),
  hit3: new Audio(bin('hit3.mp3'), { volume: 0.6 }),
  ng: new Audio(bin('ng.mp3'), { volume: 0.9 }),
  ngBad: new Audio(bin('ng-bad.mp3'), {}),
  rankUp: new Audio(bin('rank-up.mp3'), {}),
  rankMax: new Audio(bin('rank-max.mp3'), { volume: 0.8 }),
  timeCount: new Audio(bin('time-count.mp3'), { volume: 0.5 }),
  timeUp: new Audio(bin('time-up.mp3'), { volume: 0.7 }),
  resultTitle: new Audio(bin('result-title.mp3'), { volume: 0.5 }),
  resultScore: new Audio(bin('result-score.mp3'), { volume: 0.8 }),
  newRecord: new Audio(bin('new-record.mp3'), { volume: 0.9 }),
}
