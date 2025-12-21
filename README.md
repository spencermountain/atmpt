experimental compression of linguistic information by suffix or prefix.

this is a unpublished work in progress.


```js
import atmpt from './'
let trie = atmpt(null, 'prefix')
trie.add('apple', 'NS')
trie.add('apples', 'NP')
trie.add('applesauce', 'NS')

trie.debug()
// ├── a
// │   ├── p
// │   │   ├── p
// │   │   │   ├── l
// │   │   │   │   ├── e
// │   │   │   │   │    [NS]
// │   │   │   │   │   ├── s
// │   │   │   │   │   │    [NP]
// │   │   │   │   │   │   ├── a
// │   │   │   │   │   │   │   ├── u
// │   │   │   │   │   │   │   │   ├── c
// │   │   │   │   │   │   │   │   │   ├── e
// │   │   │   │   │   │   │   │   │   │    [NS]

console.log(trie.toString())
// pre|0.0.1
// true
// apple0s0auce0


```

you're free to play with and use

MIT
