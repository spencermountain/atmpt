// split up packed string by ( and ) chars
const tokenize = function (str) {
  const tokens = [];
  let current = '';
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') {
      if (current) {
        tokens.push({ str: current, depth })
      }
      depth++
      current = ''
      continue
    }
    if (char === ')') {
      if (current) {
        tokens.push({ str: current, depth })
      }
      depth -= 1
      current = ''
      continue
    }
    current += char
  }
  return tokens
}
export default tokenize

// let str = 'before(a0(b21)c)'
// let tokens = tokenize(str)
// console.log(tokens)