// ._,~-:;          animating unicode titles
// ._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_.
// -~,_.._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:
// ~-:;:-~,_.._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,

const uni = '░▒▓█▀▄'
const ani = '░░░▒▒▒▓▓▓███▓▓▓▒▒▒'

function uniFade (ele) {
  const fps = 1000 / 8

  const original = ele.textContent
  let idx = -1
  let aix = 0

  const update = () => {
    if (idx < uni.length - 1) setTimeout(update, fps)
    else if (ele.dataset.animate) animate()

    const char = idx < 0 ? ' ' : uni[idx]
    idx++
    for (let i = 0; i < original.length; i++) {
      if (uni.includes(original[i])) {
        const arr = ele.textContent.split('')
        const notThereYet = uni.indexOf(original[i]) >= uni.indexOf(char)
        if (char === ' ' || notThereYet) {
          arr[i] = char
          ele.textContent = arr.join('')
        }
      }
    }
  }

  const animate = () => {
    setTimeout(animate, fps * 0.75)
    for (let a = 0; a < original.length; a++) {
      if (uni.includes(original[a])) {
        const arr = ele.textContent.split('')
        const o = uni.indexOf(original[a])
        const j = (aix + o) % ani.length
        arr[a] = ani[j]
        ele.textContent = arr.join('')
      }
    }
    aix++
  }

  update()
}

window.uniFade = uniFade
// ._,~-:;          animating copy-text
// ._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_.
// -~,_.._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:
// ~-:;:-~,_.._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,
const wave = '._,~-:;^/!|*+()=><7[]1?il{}rt%Vx&$ODS@8X'
// const wave = 'X8@SDO$&xV%tr}{li?1][7<>=)(+*|!/^;:-~,_.'

function asciiWave (ele) {
  const scale = 3
  const ascii = wave
  const fps = 1000 / 40

  ele.dataset.html = ele.innerHTML
  ele.innerHTML = ele.textContent

  const txtNode = ele.childNodes[0]
  const breaks = getLineBreaks(txtNode).map(s => s.trim())
  const longest = breaks.reduce((a, b) => a.length > b.length ? a : b, '')
  const longestIdx = breaks.indexOf(longest)
  const longestCom = longest.replace(/ /g, '&nbsp;')
  const frames = []
  let idx = 0
  let timer = null

  const reset = () => { ele.innerHTML = ele.dataset.html }

  const update = () => {
    if (frames[longestIdx] !== longestCom) {
      timer = setTimeout(update, fps)
    } else {
      timer = setTimeout(reset, fps)
    }

    idx++
    for (let b = 0; b < breaks.length; b++) {
      const bi = idx - b * scale
      frames[b] = processLine(breaks[b], ascii, bi)
    }
    ele.innerHTML = frames.join(' ')
  }

  window.addEventListener('resize', () => {
    clearTimeout(timer)
    reset()
  })

  update()
}

function processLine (original, ascii, idx) {
  const modstr = []
  for (let i = 0; i < original.length; i++) {
    // print space if originally a space
    if (original[i] === ' ') modstr[i] = '&nbsp;'
    else {
      const a = idx - i
      // not there yet, print space
      if (a < 0) modstr[i] = '&nbsp;'
      // not in (ie. beyond) ascii, print original
      else if (a > ascii.length) modstr[i] = original[i]
      // otherwise print the ascii
      else modstr[i] = ascii[a]
    }
  }
  return modstr.join('')
}

// via: https://stackoverflow.com/a/55605049/1104148
function getLineBreaks (node) {
  // we only deal with TextNodes
  if (!node || !node.parentNode || node.nodeType !== 3) return
  // our Range object form which we'll get the characters positions
  const range = document.createRange()
  // here we'll store all our lines
  const lines = []
  // begin at the first char
  range.setStart(node, 0)
  // initial position
  const str = node.textContent
  let prevBottom = range.getBoundingClientRect().bottom
  let current = 1 // we already got index 0
  let lastFound = 0
  let bottom = 0
  // iterate over all characters
  while (current <= str.length) {
    // move our cursor
    range.setStart(node, current)
    if (current < str.length - 1) range.setEnd(node, current + 1)
    bottom = range.getBoundingClientRect().bottom
    if (bottom > prevBottom) { // line break
      lines.push(
        str.substr(lastFound, current - lastFound) // text content
      )
      prevBottom = bottom
      lastFound = current
    }
    current++
  }
  // push the last line
  lines.push(str.substr(lastFound))
  return lines
}

window.asciiWave = asciiWave
