const prepTimes = [
  [1, 0.9, 0.8, 0.6],
  [0.8, 0.7, 0.6, 0.4],
  [0.6, 0.5, 0.4, 0.2],
  [0.4, 0.35, 0.3, 0.1],
]

export function prepTime({ laps, rank }) {
  laps = Math.min(laps, 3)
  return prepTimes[laps][rank]
}

export function showCount({ laps, rank }) {
  let count = Math.min(laps, 3) + 1
  if (rank === 3) count++
  return count
}

export function badRate({ rank }) {
  return rank === 3 ? 0.1 : 0.3
}

const timeLimits = [
  [3, 3, 3, 2.5],
  [2.5, 2.5, 2.5, 2],
  [2, 2, 2, 1.5],
  [1.5, 1.5, 1.5, 1.2],
]

export function timeLimit({ laps, rank }) {
  laps = Math.min(laps, 3)
  return timeLimits[laps][rank]
}

export function hitScore({ laps, rank }) {
  return 2 ** rank * 4 ** Math.min(laps, 3) * 100
}

export function chainScore({ chain }) {
  return 2 ** Math.min(chain, 10) * 100
}

const rankExps = [
  [3, 6, 9],
  [4, 8, 12],
  [5, 10, 15],
  [6, 12, 18],
]

export function nextRankExp({ laps, rank }) {
  laps = Math.min(laps, 3)
  return rankExps[laps][rank]
}

export function prevRankExp({ laps, rank }) {
  laps = Math.min(laps, 3)
  return rankExps[laps][rank - 1] ?? 0
}

export function feverTime() {
  return 5.4
}

export function ngFeverTime({ laps }) {
  laps = Math.min(laps, 3)
  return (laps + 2) / 2
}

export function ngRankExp({ laps }) {
  laps = Math.min(laps, 3)
  return laps + 3
}

export function coolTime() {
  return 0.2
}
