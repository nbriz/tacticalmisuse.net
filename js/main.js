/* global nn, BGGradient, asciiWave, uniFade */
const bgg = new BGGradient('#222222', '#000000')

const y = window.innerHeight * 0.5
const x = window.innerWidth * 0.5
bgg.draw(x, y)

if (!nn.isMobile()) {
  window.addEventListener('mousemove', e => bgg.draw(e.clientX, e.clientY))
}

function updateShadow (e, ele) {
  const size = 10
  const center = {
    x: ele.getBoundingClientRect().left,
    y: ele.getBoundingClientRect().top
  }
  const x = e.clientX < center.x
    ? nn.map(e.clientX, 0, center.x, size, 0)
    : nn.map(e.clientX, center.x, window.innerWidth, 0, -size)
  const y = e.clientY < center.y
    ? nn.map(e.clientY, 0, center.y, size, 0)
    : nn.map(e.clientY, center.y, window.innerHeight, 0, -size)
  ele.style.textShadow = `${x}px ${y}px 5px #000`
}

const shadows = [
  ...document.querySelectorAll('p'),
  ...document.querySelectorAll('h1'),
  ...document.querySelectorAll('h2')
]

shadows.forEach(p => {
  window.addEventListener('mousemove', e => updateShadow(e, p))
})

// via: https://stackoverflow.com/a/22480938/1104148
function isScrolledIntoView (el, full) {
  const rect = el.getBoundingClientRect()
  const elemTop = rect.top
  const elemBottom = rect.bottom
  // Only completely visible elements return true:
  let isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight)
  if (!full) {
    // Partially visible elements return true:
    isVisible = elemTop < window.innerHeight && elemBottom >= 0
  }
  return isVisible
}

// --------------------------------------------------- images

const imgs = [
  ...document.querySelectorAll('img'),
  ...document.querySelectorAll('video')
]

// hide elements
imgs.forEach(img => {
  img.style.opacity = 0
  img.style.transition = 'opacity 0.5s'
  if (isScrolledIntoView(img)) {
    setTimeout(() => { img.style.opacity = 1 }, 100)
  }
})

// display elements
window.addEventListener('scroll', () => {
  imgs.forEach(img => {
    if (img.style.opacity === '0') {
      if (isScrolledIntoView(img, true)) { img.style.opacity = 1 }
    }
  })
})

// --------------------------------------------------- unicode titles

const pres = document.querySelectorAll('pre')

// hide elements
pres.forEach(pre => {
  pre.style.opacity = 0
  if (isScrolledIntoView(pre)) {
    uniFade(pre)
    pre.style.opacity = 1
  }
})

// display elements
window.addEventListener('scroll', () => {
  pres.forEach(pre => {
    if (pre.style.opacity === '0') {
      const inview = isScrolledIntoView(pre)
      if (inview) { uniFade(pre); pre.style.opacity = 1 }
    }
  })
})

// --------------------------------------------------- ascii copy

const eles = [
  ...document.querySelectorAll('p'),
  ...document.querySelectorAll('h1'),
  ...document.querySelectorAll('h2'),
  ...document.querySelectorAll('li')
]

// hide elements
eles.forEach(ele => {
  ele.style.opacity = 0
  if (isScrolledIntoView(ele)) {
    asciiWave(ele)
    ele.style.opacity = 1
  }
})

// display elements
window.addEventListener('scroll', () => {
  eles.forEach(ele => {
    if (ele.style.opacity === '0') {
      const inview = isScrolledIntoView(ele)
      if (inview) { asciiWave(ele); ele.style.opacity = 1 }
    }
  })
})
