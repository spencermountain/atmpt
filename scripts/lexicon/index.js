import nlp from 'compromise'
import { streamFile } from 'compromise-speed'
nlp.extend(streamFile)

// const file = './scripts/lexicon/fresh-prince.txt'
const file = '/Users/spencer/Desktop/infinite-jest.txt'
let counts = {}
nlp.streamFile(file, (s) => {
  // map fn on each sentence
  let m = s.if('the . of times')
  if (m.found) {
    m.debug()
  }
}).then(doc => {
  // just the returned matches
  // doc.debug()
})


// const doc = nlp.tokenize(freshPrince)

// doc.nouns().toPlural()

// console.log(doc.out('text'))