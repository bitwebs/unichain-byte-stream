# unichain-byte-stream

A Readable stream wrapper around Unichain that supports reading byte ranges.

When provided with optional start/end block heuristics, this module will efficiently sync only those blocks which contain the specified range.

Supports asynchronously specifying stream options, as well as the input feed, to remove the need for additional stream management modules like `duplexify`.

Most of the code has been extracted from [Bitdrive](https://github.com/bitwebs/bitdrive).

## Usage
The following example will return a byte stream of the entire input feed.
```js
const ram = require('random-access-memory')
const unichain = require('@web4/unichain')
const createByteStream = require('@web4/unichain-byte-stream')

let chain = unichain(ram)
let stream = createByteStream({
  feed: chain
})
```

## API
### `stream = createStream([options])`
Creates a new byte stream.

If specified, options can include:
```js
{
  feed: chain, // A unichain.
  byteOffset: 0, // Starting offset in bytes from the start of the feed.
  byteLength: 10, // The number of bytes to read.
  blockOffset: 0, // An optional starting block heuristic (optimization).
  blockLength: 10 // An optional block length that should contain the entire range (optimization).
}
```

### `stream.start([options])`
Starts downloading and streaming according to the specified options.

Options are the same as in `createStream`. If a `feed` was specified in the stream constructor, then one should *not* provide
another stream in the `start` options.

## License
MIT
