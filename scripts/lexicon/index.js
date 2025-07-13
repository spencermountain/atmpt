import nlp from 'compromise'
import fs from 'fs'
import { streamFile } from 'compromise-speed'
import atmpt from '../../src/index.js';
nlp.extend(streamFile)


// const file = './scripts/lexicon/fresh-prince.txt'
const file = '/Users/spencer/Desktop/infinite-jest.txt'
let counts = {}
const hasPunct = /[_()<>,*&#@%.]/
const hasChar = /[a-zA-Z]/
const hasNum = /[0-9]/
const isPossessive = /['’]s$/

const blacklist = new Set([
  'gately',
  'pemulis',
  'incandenza',
  'marathe',
  'steeply',
  'lenz',
  'joelle',
  'cartridge',
  'schtitt',
  'fackelmann',
  'troeltsch',
  'schacht',
  'axford',
  'notkin',
  'delint',
  'zegarelli'
])

nlp.streamFile(file, (s) => {
  s.compute('root')
  // map fn on each sentence
  s.docs.forEach(a => {
    a.forEach(term => {
      // console.log(term.root, term.normal)
      let str = term.root || term.implicit || term.normal
      if (str) {
        counts[str] = counts[str] || 0
        counts[str] += 1
      }
    })
  })
}).then(() => {
  let sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  sorted = sorted.filter(a => {
    if (a[1] <= 1) {
      return false
    }
    if (hasPunct.test(a[0]) || !hasChar.test(a[0])) {
      return false
    }
    if (isPossessive.test(a[0]) || hasNum.test(a[0])) {
      return false
    }
    // short and uncommon words
    if (a[0].length <= 2 && a[1] < 5) {
      return false
    }
    if (a[0].length <= 3 && a[1] < 4) {
      return false
    }
    if (a[0].length < 2 && a[1] < 10) {
      return false
    }
    if (blacklist.has(a[0])) {
      return false
    }
    return true
  })
  let txt = sorted.map(a => `${a[0]}   ${a[1]}`).join('\n')
  fs.writeFileSync('lexicon.txt', txt)


  const trie = atmpt(null, 'prefix')

  sorted.forEach(a => {
    trie.add(a[0])
  })
  // console.dir(trie, { depth: null })
  // console.log(trie.toString())
  trie.debug()

  let test = [
    'throne',
    'pulled',
    'pull',
    'asdflkj'
  ]
  test.forEach(word => {
    console.log(word, trie.has(word))
  })

  fs.writeFileSync('trie.json', trie.toString())
})