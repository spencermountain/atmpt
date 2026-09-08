experimental compression of linguistic information by suffix or prefix.

this is a unpublished work in progress.

`atmpt` has two models, with two jobs:

* a **Memory** — words in, burn out. It remembers every word and its val, and tallies
  evidence, but draws no conclusions. It has no lookup api at all.
* an **Out** — a burned trie, loaded from an image. Rules + exceptions, ready for lookups.

the **burn** is the moment between them: with the evidence complete, pure subtrees collapse
into prefix/suffix *rules* ("words ending in *-ed* are PastTense"), words the rules cover are
dropped, and disagreeing words stay put — exceptions living in the same trie, shadowing the
rule under longest-match lookup. Irregular and closed-class words never generalize, so they
simply survive as stored words. Nothing needs labelling by hand.

```js
import atmpt from './src/index.js'

let memory = atmpt(null, { direction: 'suffix' })
memory.add('walked', 'PastTense')
memory.add('talked', 'PastTense')
memory.add('parked', 'PastTense')
memory.add('helped', 'PastTense')
memory.add('naked', 'Adjective')
memory.add('running', 'Gerund')
memory.add('sitting', 'Gerund')
memory.add('jumping', 'Gerund')
memory.add('the', 'Determiner')

let image = memory.burn({ agreement: 0.7 })
// suf|0.2.0
// PastTense|Adjective|Gerund|Determiner
// (d0!(ekan1)eht3g2!)
```

that image reads: *"-d → PastTense, except naked → Adjective; the → Determiner; -g → Gerund"*.
A `!` marks a rule — a val placed by the burn, which may fire for unseen words. Everything
else fires on exact match only:

```js
let out = atmpt.load(image)
out.get('walked')   // 'PastTense'  (covered by the -d rule)
out.get('naked')    // 'Adjective'  (stored exception wins)
out.get('zorped')   // 'PastTense'  (never seen — the rule generalizes)
out.get('breathe')  // null  ('the' is a stored word, not a rule — it won't fire)
```

### the knobs

`support` is how many words a pattern needs before it can become a rule; `agreement` is the
fraction of them that must agree. Set them at construction or per-burn. A burn is a pure
projection — the memory is never changed — so re-burning the same memory at different knobs
is cheap (~20ms on an 18k-word lexicon), and you can sweep them to trade size against trust:

```js
memory.burn({ agreement: 0.95 })  // fewer, stricter rules — bigger image
memory.burn({ agreement: 0.55 })  // eager rules — smallest image
memory.burn({ support: 9999 })    // no rules at all: verbatim storage
```

### the diff

pass `{ diff: true }` and each `add()` prints the word, painted by what it cost:
**blue** characters created new trie structure, **yellow** characters rode existing paths.
A solid-yellow word added nothing new. That's the whole diff — no numbers, no conclusions;
those wait for the burn.

### the burn report

```js
memory.burn({ report: true })
```
```
burn ▸ 18,720 words · support 3 · agreement 0.85
  rules: 659   covered: 5,783   kept: 12,937 (418 exceptions)
  image: 62.5kb  (verbatim: 86.8kb)
  top rules:
    -ting → Gerund   349 words
    -gs → Plural   296 words
    -na → FemaleName   232 words
  near-rules:
    -d → PastTense   1640/2470   spoilers: pseud (Abbreviation), aud (Currency), ...
    -st → Superlative   390/527   spoilers: est (Abbreviation), lest (Condition), ...
```

*near-rules* are patterns that almost made the cut, with the **spoilers** that blocked
them — half the time a spoiler turns out to be a mis-tagged word, which makes the report a
decent lexicon linter.

### patching

a burned Out can take exact-word additions:

```js
out.patch('zonked', 'Adjective')
out.toString() // re-serialize, patches included
```

patches are always correct — they shadow rules via longest-match — and they can never mint a
rule, because the evidence is gone. But bytes pile up: re-burning from the source words is
always the better path. Keep your word list; a rebuild costs ~40ms.

### numbers

compromise's 18,720-word / 46-val English lexicon:

|  | size | gzipped |
|---|---|---|
| JSON | 389kb | 71kb |
| image, verbatim (no rules) | 87kb | 47kb |
| image, default knobs | 62kb | 36kb |

with 100% fidelity on every remembered word, at every knob setting. burn ≈ 30ms, load ≈ 5ms.

### api

* `atmpt(input?, opts?)` — make a Memory; opts: `{ direction: 'suffix' | 'prefix', support, agreement, diff }`
* `memory.add(word, val)` — remember a word (that's the whole public surface, plus:)
* `memory.burn(opts?)` — draw conclusions, return the image string; opts override the knobs, plus `{ report: true }`
* `atmpt.load(image)` — an Out
* `out.get(word)` — the word's val: exact if stored, else the deepest covering rule
* `out.has(word)` — is this word (or rule ending) explicitly stored?
* `out.patch(word, val)` / `out.patched` — exact-word additions, and how many so far
* `out.toString()` / `out.toJSON()` / `out.debug()`

words may contain any characters — digits, parens, pipes, emoji and newlines are escaped in
the image. vals round-trip as strings.

there's also a small cli:
```sh
atmpt burn words.json --report > image.txt
atmpt load image.txt
```

you're free to play with and use

see also:
* [efrt](https://github.com/spencermountain/efrt)

MIT
