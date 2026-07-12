// reserved chars in the packed body: \ ( ) ! and digits (value indices)
const reservedChar = /[\\()!0-9]/

// escape a single trie-edge character for the packed body
export const escapeChar = (ch) => {
  if (ch === '\n') {
    return '\\n'
  }
  if (reservedChar.test(ch)) {
    return '\\' + ch
  }
  return ch
}

// escape a dictionary value ( | separates entries, \n separates sections )
export const escapeValue = (val) => {
  return String(val)
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, '\\n')
}

// split a dictionary line on unescaped pipes, unescaping each value
export const splitDict = (line) => {
  if (line === '') {
    return []
  }
  const values = []
  let current = ''
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (ch === '\\') {
      const next = line[i + 1]
      current += next === 'n' ? '\n' : next
      i += 1
    } else if (ch === '|') {
      values.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  values.push(current)
  return values
}
