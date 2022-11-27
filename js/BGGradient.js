/* global TWEEN */
class BGGradient {
  constructor (color, bgColor) {
    document.body.style.background = bgColor
    this.color = (typeof color === 'string') ? this._hex2rbg(color) : color
    this.x = 0
    this.y = 0
    this.createCanvas()
    window.addEventListener('resize', () => this._resize(), false)
    if (color) this.draw()
  }

  createCanvas () {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.canvas.style.position = 'fixed'
    this.canvas.style.left = '0px'
    this.canvas.style.top = '0px'
    this.canvas.style.zIndex = '-2'
    document.body.appendChild(this.canvas)
  }

  _hex2rbg (hex) {
    // via: https://stackoverflow.com/a/5624139
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b
    })
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  _resize () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  _draw (r) {
    const g = this.ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, r)
    // g.addColorStop(0, this.color + 'EE')
    // g.addColorStop(1, this.color + '00')
    g.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`)
    g.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`)
    this.ctx.fillStyle = g
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  _drawCircle (x, y, rad) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, rad, 0, 2 * Math.PI, false)
    this.ctx.fillStyle = 'green'
    this.ctx.fill()
    this.ctx.lineWidth = 5
    this.ctx.strokeStyle = '#003300'
    this.ctx.stroke()
  }

  _rainbow (r) {
    const colors = [
      '#bc6957', '#ffb169',
      '#8aa96f', '#88966a',
      '#6160ff', '#303579'
    ]
    colors.forEach((clr, i) => {
      let rad = r / 3
      rad *= (1 - (i * (0.75 / colors.length)))
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, rad, 0, 2 * Math.PI, false)
      this.ctx.fillStyle = clr + 'ff'
      this.ctx.fill()
    })
  }

  changeColor (color) {
    this.color = (typeof color === 'string') ? this._hex2rbg(color) : color
  }

  transition (color, time) {
    const c = (typeof color === 'string') ? this._hex2rbg(color) : color
    new TWEEN.Tween(this.color)
      .to({ r: c.r, g: c.g, b: c.b }, time)
      .onUpdate(() => this.draw())
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start()
  }

  draw (x, y) {
    if (x) this.x = x
    if (y) this.y = y
    const w = window.innerWidth
    const h = window.innerHeight
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const radius = (w > h) ? w : h
    this._draw(radius)
  }
}

if (typeof module !== 'undefined') module.exports = BGGradient
