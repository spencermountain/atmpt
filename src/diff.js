const BLUE = '\x1b[34m'
const YELLOW = '\x1b[33m'
const RESET = '\x1b[0m'

// paint a word by what it cost: blue chars created new trie structure,
// yellow chars rode existing paths. a solid-yellow word added nothing new.
export const colorize = (chars, isNew) => {
  let out = ''
  let current = null
  chars.forEach((ch, i) => {
    const color = isNew[i] ? BLUE : YELLOW
    if (color !== current) {
      out += color
      current = color
    }
    out += ch
  })
  return out + RESET
}
