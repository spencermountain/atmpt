experimental compression of linguistic information by suffix or prefix.

this is a unpublished work in progress.

`atmpt` packs a `{word: tag}` lexicon into a character trie, then into a very small string.
Its real trick is `generalize()` — collapsing pure subtrees into prefix/suffix *rules*, so the
trie learns things like *"words ending in -ed are PastTense"*, while irregular words stay stored
exactly, in the same trie. This makes a tight first-pass POS tagger for any language with
morphology in its affixes.

```js
import atmpt from './src/index.js'

let trie = atmpt(null, 'prefix')
trie.add('apple', 'NS')
trie.add('apples', 'NP')
trie.add('applesauce', 'NS')

trie.get('apples')
// 'NP'

console.log(trie.toString())
// pre|0.1.0
// NS|NP
// apple0(s1(auce0))
```

suffix example:
```js
let trie = atmpt(null, 'suffix')

trie.from({
  bedfordshire: 'England',
  aberdeenshire: 'Scotland',
  buckinghamshire: 'England',
  argyllshire: 'Scotland',
  bambridgeshire: 'England',
  cheshire: 'England',
  ayrshire: 'Scotland',
  banffshire: 'Scotland'
})

trie.get('cheshire')
// 'England'

let packed = trie.toString()
// post|0.1.0
// England|Scotland
// erihs(drofdeb0e(gdirbmab0hc0)ffnab1llygra1mahgnikcub0needreba1rya1)

let again = atmpt.unpack(packed)
again.get('cheshire')
// 'England'
```

### generalize()

give it words with one tag each, then let it find the patterns:

```js
let trie = atmpt({
  walked: 'PastTense', talked: 'PastTense', parked: 'PastTense', helped: 'PastTense',
  naked: 'Adjective',
  running: 'Gerund', sitting: 'Gerund', jumping: 'Gerund',
  the: 'Determiner',
}, 'suffix')

trie.generalize({ minSupport: 3, minPurity: 0.7 })

console.log(trie.toString())
// post|0.1.0
// PastTense|Adjective|Gerund|Determiner
// (d0!(ekan1)eht3g2!)
```

that packed string reads: *"-d → PastTense, except naked → Adjective; the → Determiner; -g → Gerund"*.
Rules and exceptions live in one trie — an exception is just a deeper value that shadows a rule
under longest-match lookup. Nothing needs labelling by hand: a `!` marks values placed by the
pruner, and only those fire for unseen words:

```js
trie.get('walked')   // 'PastTense'  (covered by the -d rule)
trie.get('naked')    // 'Adjective'  (stored exception wins)
trie.get('zorped')   // 'PastTense'  (never seen — the rule generalizes)
trie.get('breathe')  // null  ('the' is a stored word, not a rule — it won't fire)
```

`minSupport` is how many words a pattern needs before it can become a rule;
`minPurity` is the fraction of them that must agree. Raise them for precision,
lower them for coverage.

### numbers

on a real 18,720-word / 46-tag English lexicon:

|  | size | gzipped |
|---|---|---|
| JSON | 389kb | 71kb |
| packed | 87kb | 47kb |
| packed + generalized | 62kb | 36kb |

with 100% fidelity on every stored word after pack → unpack, and ~83% precision
tagging unseen words from the rules alone. pack ≈ 20ms, unpack ≈ 6ms.

### api

* `atmpt(input?, direction?)` — make a trie; direction is `'prefix'` or `'suffix'` (default `'suffix'`)
* `trie.add(word, tag)` / `trie.from(objOrArray)` — add words
* `trie.get(word)` — the word's tag: exact if stored, otherwise the deepest rule that covers it
* `trie.has(word)` — is this word (or rule ending) explicitly stored?
* `trie.generalize({ minSupport, minPurity })` — collapse pure subtrees into rules
* `trie.toString()` — pack to a string
* `atmpt.unpack(str)` — restore a trie from a packed string

words may contain any characters — digits, parens, pipes, emoji and newlines are escaped in the
packed form. tags round-trip as strings.

there's also a small cli:
```sh
atmpt pack words.json --generalize > packed.txt
atmpt unpack packed.txt
```

you're free to play with and use

see also:
* [efrt](https://github.com/spencermountain/efrt)

MIT
