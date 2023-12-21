import { code2nums, nums2code } from '@/lib/code.js'

export function getReplayQuery() {
  return new URL(location).searchParams.get('re')
}

export function clearReplayQuery() {
  const url = new URL(location)
  url.searchParams.delete('re')
  history.replaceState(history.state, '', url)
}

export function getReplayUrl(code) {
  const url = new URL(location)
  url.hash = ''
  url.search = ''
  url.searchParams.set('re', code)
  return url.href
}

export function getRecord() {
  return localStorage.getItem('fire-max-record')
}

export function setRecord(code) {
  return localStorage.setItem('fire-max-record', code)
}

const replayVersion = 0

export function decodeReplayCode(code) {
  let nums = []

  try {
    nums = code2nums(code)
  } catch {}

  if (nums[0] !== replayVersion) return

  return {
    seed: nums[2],
    score: nums[3],
    hits: nums.slice(4, 8),
    keyLog: nums.slice(8),
  }
}

export function encodeReplayCode(data) {
  return nums2code([replayVersion, 0, data.seed, data.score, ...data.hits, ...data.keyLog])
}

export function isTipsRead() {
  return localStorage.getItem('fire-max-tips') === 'true'
}

export function setTipsRead() {
  localStorage.setItem('fire-max-tips', 'true')
}

export function isMute() {
  return localStorage.getItem('fire-max-mute') === 'true'
}

export function setMute(value) {
  localStorage.setItem('fire-max-mute', value ? 'true' : 'false')
}
