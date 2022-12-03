/* global Netitor */
function copyLink (ne) {
  navigator.clipboard.writeText(ne.code)
  const pos = ne.ele.getBoundingClientRect()
  const note = document.createElement('div')
  note.innerHTML = '<span>Copied Code!</span>'
  note.style.display = 'flex'
  note.style.justifyContent = 'center'
  note.style.alignItems = 'center'
  note.style.background = 'grey'
  note.style.position = 'fixed'
  note.style.left = `${pos.x}px`
  note.style.top = `${pos.y}px`
  note.style.zIndex = 1000
  note.style.width = `${pos.width}px`
  note.style.height = `${pos.height}px`
  note.style.backgroundColor = '#fff'
  note.style.color = '#000'
  note.style.padding = '4px 20px'
  note.style.opacity = '1'
  note.style.transition = 'opacity 2s'
  document.body.appendChild(note)
  setTimeout(() => {
    note.style.opacity = 0
    setTimeout(() => note.remove(), 2200)
  }, 500)
}

const ne1 = new Netitor({
  ele: '#bg-code1',
  code: `window.addEventListener('scroll', () => {
  document.querySelectorAll('.r-1k6nrdp').forEach(num => { num.style.display = 'none' })
})`,
  language: 'javascript',
  readOnly: true,
  theme: 'moz-dark'
})

ne1.ele.addEventListener('click', () => copyLink(ne1))

const ne2 = new Netitor({
  ele: '#bg-code2',
  code: `{
  "manifest_version": 2,
  "name": "demetricate",
  "version": "1.0",
  "description": "removes metrics from a twitter feed",
  "icons": {
    "48": "icon.png"
  },
  "content_scripts": [
    {
      "matches": ["*://*.twitter.com/*"],
      "js": ["demetricate.js"]
    }
  ]
}`,
  language: 'javascript',
  readOnly: true,
  theme: 'moz-dark'
})

ne2.ele.addEventListener('click', () => copyLink(ne2))
