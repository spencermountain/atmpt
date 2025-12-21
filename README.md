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

let val = trie.get('cheshire') 
// 'England'

let packed = trie.toString()
// post|0.0.1
// England|Scotland
// erihs(drofdeb0needreba1mahgnikcub0llygra1e(gdirbmab0hc0)rya1ffnab1)

```

you're free to play with and use

see also:
* [efrt](https://github.com/spencermountain/efrt)

MIT
