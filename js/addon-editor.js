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

const iconData = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA73pUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjadVFRDsMgCP3nFDuCgKIcx65tshvs+KOKbW2yZwR5EBCA7fvZ4XWAlCCmXERFgiFqVKr2KKFjaRJDbLIhusvsiYfTQUaxae6mkvOb8XQmDepFcMSPROOB1V7pclSvgMuDf3vd8kzklRm98updeSKmzqPbb48XLXlqbZUwo1w3sXAmSXa2zFJkzy2dXnMKw4Y7EbONe032ASbaGDmYZC79Z3zcyNW0NhktDu1Ui0FolPR12Poo5DZI78NL2ADv8zj1sWJvD6aV8uWY+D+4tw6jd/gB5n95QMUF9WwAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX9OKH1QU7CBSIUN1souKONYqFKFCqBVadTC59AuaNCQpLo6Ca8HBj8Wqg4uzrg6ugiD4AeLs4KToIiX+Lym0iPXguB/v7j3u3gFCvcw0KxADNN02U4m4mMmuit2v6EUAgwhjVGaWMSdJSXQcX/fw8fUuyrM6n/tz9Ks5iwE+kTjGDNMm3iCe2bQNzvvEIVaUVeJz4gmTLkj8yHXF4zfOBZcFnhky06l54hCxWGhjpY1Z0dSIp4kjqqZTvpDxWOW8xVkrV1nznvyFwZy+ssx1mmEksIglSBChoIoSyrARpVUnxUKK9uMd/COuXyKXQq4SGDkWUIEG2fWD/8Hvbq381KSXFIwDXS+O8zEGdO8CjZrjfB87TuME8D8DV3rLX6kDs5+k11pa5AgY2AYurluasgdc7gDDT4Zsyq7kpynk88D7GX1TFhi6BfrWvN6a+zh9ANLUVfIGODgExguUvd7h3T3tvf17ptnfD3SBcqcMrtVoAAAOZ2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjYxOTEyNTAwLTkyODEtNDdkZi1hNzA2LTc5NWRkNjNmZWM3YyIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplY2Q0NDc4MS1iZmQ5LTQwZWItYTA2ZC05OTdiNjZjNTJkMGIiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjMzE2N2UzMi00ODA2LTQzY2UtOTY0Ny0yNzJkYWVjZWI5YWEiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09Ik1hYyBPUyIKICAgR0lNUDpUaW1lU3RhbXA9IjE3MjU0Njc0Njg0NjQyNzQiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zOCIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSIxNTU2IgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iMTQ0MCIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjQ6MDk6MDRUMTE6MzE6MDYtMDU6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDI0OjA5OjA0VDExOjMxOjA2LTA1OjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzllZjhmMmQtYTAzOC00YWViLTlhYmQtZTM0Y2E3MTA2NTBkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKE1hYyBPUykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjQtMDktMDRUMTE6MzE6MDgtMDU6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogICA8ZXhpZjpVc2VyQ29tbWVudD4KICAgIDxyZGY6QWx0PgogICAgIDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+U2NyZWVuc2hvdDwvcmRmOmxpPgogICAgPC9yZGY6QWx0PgogICA8L2V4aWY6VXNlckNvbW1lbnQ+CiAgPC9yZGY6RGVzY3JpcHRpb24+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz5lzin7AAAABmJLR0QA2wDLALfPmaq5AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAB3RJTUUH6AkEEB8IaxbjtQAAABJ0RVh0Q29tbWVudABTY3JlZW5zaG90+xGrCgAACeRJREFUeNrtW0tME08Y/223W9pCoWAJVqqA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'


function download () {
  const zip = new JSZip()
  const name = JSON.parse(manifest.code).name.replace(/ /g, '-').toLowerCase()
  const folder = zip.folder(name)
  folder.file('manifest.json', manifest.code)
  folder.file('main.js', editor.code)
  folder.file('icon.png', iconData, { base64: true })

  zip.generateAsync({ type: 'blob' })
    .then(content => saveAs(content, `${name}.zip`))
}
document.querySelector('#download').addEventListener('click', download)
document.querySelector('#download2').addEventListener('click', download)

document.querySelector('#install').addEventListener('click', () => {
  document.querySelector('#how-to-install').style.display = 'flex'
})

document.querySelector('#close-how-to').addEventListener('click', () => {
  document.querySelector('#how-to-install').style.display = 'none'
})

document.querySelector('#example').addEventListener('click', () => {
  window.open('/scripts', '_blank')
})
