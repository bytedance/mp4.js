import EventEmitter from 'event-emitter'
import Errors from '../error'

class MSE {
  constructor (codecs = 'video/mp4; codecs="avc1.64001E, mp4a.40.5"') {
    const self = this
    EventEmitter(this)
    this.codecs = codecs
    this.mediaSource = new window.MediaSource()
    this.url = window.URL.createObjectURL(this.mediaSource)
    this.queue = []
    this.updating = false
    this.mediaSource.addEventListener('sourceopen', function () {
      if (self.mediaSource.sourceBuffers.length === 0) {
        self.sourceBuffer = self.mediaSource.addSourceBuffer(self.codecs)
        self.sourceBuffer.addEventListener('error', function (e) {
          self.emit('error', new Errors('mse', '', { line: 16, handle: '[MSE] constructor sourceopen', msg: e.message }))
        })
        self.sourceBuffer.addEventListener('updateend', function (e) {
          self.emit('updateend')
          const buffer = self.queue.shift()
          if (buffer && self.sourceBuffer && !self.sourceBuffer.updating && self.state === 'open') {
            self.sourceBuffer.appendBuffer(buffer)
          }
        })
        self.emit('sourceopen')
      }
    })
    this.mediaSource.addEventListener('sourceclose', function () {
      self.emit('sourceclose')
    })
  }

  get state () {
    return this.mediaSource.readyState
  }

  get duration () {
    return this.mediaSource.duration
  }

  set duration (value) {
    this.mediaSource.duration = value
  }

  appendBuffer (buffer) {
    const sourceBuffer = this.sourceBuffer
    if (sourceBuffer && !sourceBuffer.updating && this.state === 'open') {
      sourceBuffer.appendBuffer(buffer)
      return true
    } else {
      this.queue.push(buffer)
      return false
    }
  }

  removeBuffer (start, end) {
    this.sourceBuffer.remove(start, end)
  }

  clearBuffer () {
    if (this.sourceBuffer) {
      const buffered = this.sourceBuffer.buffered
      for (let i = 0; i < buffered.length; i++) {
        this.sourceBuffer.remove(buffered.start(i), buffered.end(i))
      }
    }
  }

  endOfStream () {
    if (this.state === 'open') {
      this.mediaSource.endOfStream()
    }
  }

  static isSupported (codecs) {
    return window.MediaSource && window.MediaSource.isTypeSupported(codecs)
  }
}

export default MSE
