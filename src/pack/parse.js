import Node from '../Node.js'

const isDigit = (ch) => ch >= '0' && ch <= '9'

// single-pass parser for the packed body (see toString.js for the grammar).
// `base` is the node the next character extends; `groupStack` holds the
// owners of open '(' groups; after a value or a ')' the current node is
// complete, so the next character starts a sibling under the group owner.
const parse = function (body, dictionary) {
  const str = [...body] // code points, so surrogate pairs stay whole
  const root = new Node()
  const groupStack = []
  let base = root
  let complete = false

  const startChar = () => {
    if (complete) {
      // a new sibling — attach under the enclosing group's owner
      if (groupStack.length === 0) {
        throw new Error('atmpt: unexpected sibling at top level of packed string')
      }
      base = groupStack[groupStack.length - 1]
      complete = false
    }
  }
  const addChild = (ch) => {
    startChar()
    if (!base.children[ch]) {
      base.children[ch] = new Node()
    }
    base = base.children[ch]
  }

  for (let i = 0; i < str.length; i += 1) {
    const ch = str[i]
    if (ch === '\\') {
      const next = str[i + 1]
      addChild(next === 'n' ? '\n' : next)
      i += 1
    } else if (ch === '(') {
      // children of `base` — including the first one — attach under it
      groupStack.push(base)
      complete = true
    } else if (ch === ')') {
      if (groupStack.length === 0) {
        throw new Error('atmpt: unbalanced ")" in packed string')
      }
      groupStack.pop()
      complete = true
    } else if (isDigit(ch)) {
      if (complete) {
        throw new Error('atmpt: unexpected value index in packed string')
      }
      let num = ch
      while (isDigit(str[i + 1])) {
        i += 1
        num += str[i]
      }
      const idx = parseInt(num, 10)
      if (dictionary[idx] === undefined) {
        console.warn(`Warning: dictionary[${idx}] not found`) // eslint-disable-line
      } else {
        base.value = dictionary[idx]
      }
      if (str[i + 1] === '!') {
        base.rule = true
        i += 1
      }
      complete = true
    } else {
      addChild(ch)
    }
  }
  if (groupStack.length !== 0) {
    throw new Error('atmpt: unclosed "(" in packed string')
  }
  return root
}
export default parse
