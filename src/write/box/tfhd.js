import Box from '../box'
Box.tfhd = function (data, output) {
  const stream = this.stream
  stream.writeUint8(data.version)
  stream.writeUint24(data.flag)
  stream.writeUint32(data.trackID)
  if (data.sampleDuration) {
    stream.writeUint32(data.sampleDuration)
  }
  if (data.sampleFlag) {
    stream.writeUint32(data.sampleFlag)
  }
  output.write(new Uint8Array(stream.buffer.slice(0, stream.position)))
  if (stream.position !== data.size - 8) {
    throw new Error(`${data.type} box incomplete`)
  }
  delete this.data
}
