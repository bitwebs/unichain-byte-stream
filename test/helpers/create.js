const ram = require('random-access-memory')
const unichain = require('@web4/unichain')

const createStream = require('../..')

function createLocal (numRecords, recordSize, cb) {
  const chain = unichain(ram)

  const records = []
  for (let i = 0; i < numRecords; i++) {
    const record = Buffer.allocUnsafe(recordSize).fill(Math.floor(Math.random() * 10))
    records.push(record)
  }

  chain.append(records, err => {
    if (err) return cb(err)
    const stream = createStream()
    return cb(null, chain, chain, stream, records)
  })
}

function createRemote (numRecords, recordSize, cb) {
  const chain1 = unichain(ram, { sparse: true })

  const records = []
  for (let i = 0; i < numRecords; i++) {
    const record = Buffer.allocUnsafe(recordSize).fill(Math.floor(Math.random() * 10))
    records.push(record)
  }

  chain1.append(records, err => {
    if (err) return cb(err)

    const chain2 = unichain(ram, chain1.key, { sparse: true })

    const s1 = chain1.replicate(true, { live: true })
    s1.pipe(chain2.replicate(false, { live: true })).pipe(s1)

    const stream = createStream()
    return cb(null, chain1, chain2, stream, records)
  })
}

module.exports = {
  createLocal,
  createRemote
}
