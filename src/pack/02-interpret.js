import Node from '../Node.js'
import tokenize from './01-tokenize.js'
const strNum = /(\d+)/

// interpret 'ab0c0' into ab, c
const splitParts = function (str, dictionary) {
  let parts = str.split(strNum)
  let res = []
  if (parts[parts.length - 1] === '') {
    parts.pop()
  }
  for (let i = 0; i < parts.length; i += 2) {
    let str = parts[i]
    let val = parts[i + 1]
    if (val === '' || val === undefined) {
      val = null
    } else {
      val = parseInt(val, 10)
      if (dictionary[val] === undefined) {
        console.warn(`Warning: dictionary[${val}] not found`)
        val = null
      } else {
        val = dictionary[val]
      }
    }
    res.push({ str, val })
  }
  return res
}

// put 'abcd' as descendants
const addSequence = function (word, node, val) {
  let chars = word.split('')
  let curr = node
  chars.forEach(c => {
    curr.children[c] = curr.children[c] || new Node(c, null)
    curr = curr.children[c]
  })
  // add the value on the end
  curr.value = val
  return curr
}

const parse = function (str, dictionary) {
  let tokens = tokenize(str)
  let root = new Node()
  let stack = [root]

  for (let i = 0; i < tokens.length; i += 1) {
    let { depth, str } = tokens[i]
    // interpret 'ab0c0' into ab, c
    let parts = splitParts(str, dictionary)
    let curr = stack[stack.length - 1]
    let end = null
    parts.forEach(part => {
      // add consecutive chars as a nested sequence
      end = addSequence(part.str, curr, part.val)
    })
    // prepare the stack for the next token
    let nextToken = tokens[i + 1]
    if (nextToken && nextToken.depth > depth) {
      stack.push(end)
    } else if (nextToken && nextToken.depth < depth) {
      stack.pop()
    }
  }
  // console.dir(root, { depth: null })
  return root
}
export default parse

// let str = 'pre0(a(b0)c0)'
// str = 'pre0(o(ne0k0)two0)'
// parse(str)