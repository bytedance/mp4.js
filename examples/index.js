const video = document.querySelector('#mp4')
const mp4 = new window.MP4('./xgplayer-demo-720p.mp4')
let mse
let timer

mp4.on('moovReady', function () {
  mse = new window.MP4.MSE()
  video.src = mse.url
  mse.on('sourceopen', () => {
    mse.appendBuffer(mp4.packMeta())
    mse.once('updateend', loadData)
  })
  video.addEventListener('timeupdate', function () {
    loadData(1)
  })
})

function loadData (i = 0, time = video.currentTime) {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    mp4.seek(time + i * 0.1).then(buffer => {
      if (buffer) {
        mse.updating = true
        mse.appendBuffer(buffer)
        mse.once('updateend', () => {
          mse.updating = false
        })
      }
    }, (error) => {
      console.error(error)
      if (i < 10) {
        timer = setTimeout(() => {
          this.loadData(i + 1)
        }, 2000)
      }
    })
  }, 50)
}
