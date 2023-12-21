const keyCodes = [
  ['KeyQ', 'Numpad7', 'Digit7'],
  ['KeyW', 'Numpad8', 'Digit8'],
  ['KeyE', 'Numpad9', 'Digit9'],
  ['KeyA', 'Numpad4', 'KeyU'],
  ['KeyS', 'Numpad5', 'KeyI'],
  ['KeyD', 'Numpad6', 'KeyO'],
  ['KeyZ', 'Numpad1', 'KeyJ'],
  ['KeyX', 'Numpad2', 'KeyK'],
  ['KeyC', 'Numpad3', 'KeyL'],
]

const keyDowns = []

const resetKeycodes = ['Enter', 'Escape', 'NumpadEnter']
let resetKeyDown = false

window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') return e.preventDefault()
  const i = keyCodes.findIndex((codes) => codes.includes(e.code))
  if (i >= 0 && !isPlay) keyDowns[i] = true
  if (resetKeycodes.includes(e.code)) resetKeyDown = true
})

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

let isPlay = false
let isRec = false
let log = []
let waitCount = 0
let logIndex = 0

export function setKeyLog(data) {
  log = data
}

export function getKeyLog() {
  return log
}

export function playKeyLog() {
  isPlay = true
  isRec = false
  waitCount = 0
  logIndex = 0
}

export function recKeyLog() {
  isPlay = false
  isRec = true
  log = []
  waitCount = 0
}

export function endKeyLog() {
  if (isRec) log.push(waitCount + keyCodes.length)
  isPlay = isRec = false
}

export function setKeyDown(index) {
  if (!isPlay) keyDowns[index] = true
}

export function isKeyDown(index) {
  return keyDowns[index] === true
}

export function isAnyKeyDown() {
  return keyDowns.some((down) => down) || resetKeyDown
}

export function isResetKeyDown() {
  return resetKeyDown
}

export function beforeUpdateKeys() {
  if (isPlay) {
    keyDowns.fill(false)
    if (waitCount < log[logIndex] - keyCodes.length) {
      waitCount++
    } else {
      waitCount = 0
      for (logIndex++; log[logIndex] < keyCodes.length; logIndex++) {
        keyDowns[log[logIndex]] = true
      }
    }
  }
}

export function afterUpdateKeys() {
  if (isRec) {
    if (keyDowns.indexOf(true) < 0) {
      waitCount++
    } else {
      log.push(waitCount + keyCodes.length)
      waitCount = 0
      for (let i = 0; i < keyDowns.length; i++) {
        if (keyDowns[i]) log.push(i)
      }
    }
  }

  keyDowns.fill(false)
  resetKeyDown = false
}
