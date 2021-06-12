const crypto = require('crypto')
const key1= crypto.randomBytes(32).toString('hex')
const key2= crypto.randomBytes(32).toString('hex')

console.table({key1, key2});

// │  key1   │ '3ea598c4bf6c3bdca134e0e105f06765c5804171549a525feab018fa4dc39940' │
// │  key2   │ '7179067077110f308fd6fece57f546578ee6204870573ff74d8c92d10a789233'