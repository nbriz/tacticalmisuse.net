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
  code: "document.body.style.background = 'red'",
  language: 'javascript',
  readOnly: true,
  theme: 'monokai'
})

ne1.ele.addEventListener('click', () => copyLink(ne1))

const ne2 = new Netitor({
  ele: '#bg-code2',
  code: "document.body.style.background = 'linear-gradient(135deg, #c00 50%, #000 50%)'",
  language: 'javascript',
  readOnly: true,
  theme: 'monokai'
})

ne2.ele.addEventListener('click', () => copyLink(ne2))

const ne3 = new Netitor({
  ele: '#bg-code3',
  code: `document.querySelectorAll('div').forEach(d => {
  d.style.transition = 'all 300s'
  d.style.transform = 'rotate(1000deg)'
})`,
  language: 'javascript',
  readOnly: true,
  theme: 'monokai'
})

ne3.ele.addEventListener('click', () => copyLink(ne3))
