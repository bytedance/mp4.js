import Box from '../box'
Box.co64 = function (data, output) {
  const stream = this.stream
  stream.writeUint8(data.version)
  stream.writeUint24(data.flag)
  stream.writeUint32(data.count)
  data.entries.forEach(item => {
    stream.writeUint64(item)
  })
  output.write(new Uint8Array(stream.buffer.slice(0, stream.position)))
  if (stream.position !== data.size - 8) {
    throw new Error(`${data.type} box incomplete`)
  } else {
    this.outputSize = stream.position
  }
  delete this.data
}
