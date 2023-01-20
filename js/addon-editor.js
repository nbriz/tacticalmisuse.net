/* global nn, BGGradient, Netitor, JSZip, saveAs, uniFade */

uniFade(document.querySelector('#header'))

// ------------------------------------------------- background gradient -------

const bgg = new BGGradient('#232327', '#000000')
const y = window.innerHeight * 0.5
const x = window.innerWidth * 0.5
bgg.draw(x, y)
window.addEventListener('resize', () => {
  const y = window.innerHeight * 0.5
  const x = window.innerWidth * 0.5
  bgg.draw(x, y)
})

if (!nn.isMobile()) {
  window.addEventListener('mousemove', e => bgg.draw(e.clientX, e.clientY))
}

// ---------------------------------------------------- code editor ------------

const editor = new Netitor({
  ele: '#editor',
  language: 'javascript',
  theme: 'moz-dark',
  background: false,
  code: `window.addEventListener('load', () => {
  // this code will run when the page is fully loaded
})

window.addEventListener('scroll', () => {
  // this code will run when the page scrolls
})

window.addEventListener('click', (e) => {
  // this will run when something is clicked
  // e.preventDefault() // stop default click function
  e.target // the clicked element
})`
})

const reset = () => {
  document.querySelector('#console').innerHTML = ''
  document.querySelector('#console').className = ''
  editor.spotlight('clear')
}

const markErrors = (eve) => {
  const explainError = (err) => {
    editor.spotlight(err.line)
    document.querySelector('#console').className = 'error'
    document.querySelector('#console').innerHTML = err.friendly || err.message
  }

  editor.marker(null)
  const lines = []
  if (eve.length === 0) window.reset()
  eve.forEach(e => {
    if (lines.includes(e.line)) return
    lines.push(e.line)
    const clk = () => explainError(e)
    if (e.type === 'warning') editor.marker(e.line, 'yellow', clk)
    else editor.marker(e.line, 'red', clk)
  })
}

const showJSNFO = (eve) => {
  document.querySelector('#console').className = 'edu'

  document.querySelector('#console').innerHTML = `
    <b>${eve.nfo.keyword.html}</b>
  `
  if (eve.nfo.description) {
    document.querySelector('#console').innerHTML += `:<br><br>
    ${eve.nfo.description.html}`
  } else if (eve.nfo.status && eve.nfo.status !== 'standard') {
    document.querySelector('#console').innerHTML += `. (<b>NOTE</b>: this CSS feature is ${eve.nfo.status}).`
  }
}

editor.on('lint-error', (eve) => markErrors(eve))

editor.on('edu-info', (eve) => {
  if (eve.nfo && eve.language === 'javascript') showJSNFO(eve)
  else reset()
})

editor.on('cursor-activity', (eve) => reset())

const manifest = new Netitor({
  ele: '#manifest',
  language: 'javascript',
  theme: 'moz-dark',
  background: false,
  code: `{
  "manifest_version": 2,
  "name": "YOUR ADD-ON NAME",
  "version": "1.0",
  "description": "YOUR ADD-ON DESCRIPTION",
  "icons": {
    "48": "icon.png"
  },
  "content_scripts": [
    {
      "matches": ["*://*.WEBSITE.com/*"],
      "js": ["main.js"]
    }
  ]
}`
})

// ---------------------------------------------------------- menu logix -------

const iconData = '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'

document.querySelector('#download').addEventListener('click', () => {
  const zip = new JSZip()
  const folder = zip.folder('tactical-misuse')
  folder.file('manifest.json', manifest.code)
  folder.file('main.js', editor.code)
  folder.file('icon.png', iconData, { base64: true })

  zip.generateAsync({ type: 'blob' })
    .then(content => saveAs(content, 'tactical-misuse.zip'))
})

document.querySelector('#install').addEventListener('click', () => {
  window.open('/how/add-ons', '_blank')
})

document.querySelector('#example').addEventListener('click', () => {
  window.open('/scripts', '_blank')
})
