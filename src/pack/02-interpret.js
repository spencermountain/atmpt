import Node from '../Node.js'
import tokenize from './01-tokenize.js'
const strNum = /(\d+$)/

// put 'abcd' as descendants
const addSequence = function (word, node, val) {
  let chars = word.split('')
  let curr = node
  chars.forEach(c => {
    curr.children[c] = curr.children[c] || new Node(c, null)
    curr = curr.children[c]
  })
  // add the value on the end
  if (val !== undefined && val.length > 0) {
    val = parseInt(val, 10)
    curr.val = val
  }
  return curr
}

const parse = function (str) {
  let tokens = tokenize(str)
  let root = new Node()
  let stack = [root]

  for (let i = 0; i < tokens.length; i += 1) {
    let { depth, str } = tokens[i]
    let [word, val] = str.split(strNum)
    let curr = stack[stack.length - 1]

    // add all these chars as a sequence
    let end = addSequence(word, curr, val)

    // prepare the stack for the next token
    let nextToken = tokens[i + 1]
    if (nextToken && nextToken.depth > depth) {
      stack.push(end)
    } else if (nextToken && nextToken.depth < depth) {
      stack.pop()
    }
  }
  return root
}
export default parse

// let str = 'pre0(a(b0)c0)'
// str = 'pre0(o(ne0k0)two0)'
// parse(str)