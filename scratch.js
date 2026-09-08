import atmpt from './src/index.js';

// words in — the diff paints each word by what it cost:
// blue = new characters, yellow = characters that rode existing paths
let memory = atmpt(null, { direction: 'suffix', diff: true })
memory.add('walked', 'PastTense')
memory.add('talked', 'PastTense')
memory.add('parked', 'PastTense')
memory.add('helped', 'PastTense')
memory.add('naked', 'Adjective')
memory.add('running', 'Gerund')
memory.add('sitting', 'Gerund')
memory.add('jumping', 'Gerund')
memory.add('the', 'Determiner')

// burn out — conclusions are drawn here, from complete evidence
let image = memory.burn({ agreement: 0.7, report: true })
console.log(image)

let out = atmpt.load(image)
console.log('walked  →', out.get('walked'))   // PastTense  (covered by the -d rule)
console.log('naked   →', out.get('naked'))    // Adjective  (stored exception wins)
console.log('zorped  →', out.get('zorped'))   // PastTense  (never seen — the rule generalizes)
console.log('breathe →', out.get('breathe'))  // null       ('the' is a word, not a rule)
