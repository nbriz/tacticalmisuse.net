// ._,~-:;           u can && must hack algorithms NOW
// ._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_.
// -~,_.._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:
// ~-:;:-~,_.._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,~-:;:-~,_._,
const storage = (typeof browser !== 'undefined') ? browser.storage : chrome.storage
const terms = [
  { com: 'google.com', tos: 'https://policies.google.com/terms' },
  { com: 'youtube.com', tos: 'https://www.youtube.com/t/terms' },
  { com: 'facebook.com', tos: 'https://www.facebook.com/terms' },
  { com: 'instagram.com', tos: 'https://help.instagram.com/581066165581870' },
  { com: 'bing.com', tos: 'https://www.bing.com/new/summaryofterms' },
  { com: 'twitter.com', tos: 'https://twitter.com/en/tos' },
  { com: 'x.com', tos: 'https://x.com/en/tos' }
]

function next (stage) {
  if (!stage) {
    stage = document.body.dataset.tmstage
      ? Number(document.body.dataset.tmstage) : 0
    stage += 1
  }

  if (stage === 1) {
    bitCrushScreen()
    part1()
  } else if (stage === 2) {
    colorBack()
    part2()
  } else if (stage === 3) {
    gravityElements()
    slowScrollDown(1)
    part3()
  } else if (stage === 4) {
    part4()
  } else if (stage === 5) {
    part5()
  }

  document.body.dataset.tmstage = stage
}

function init () {
  // if we're on a TOS page do nothing
  const thisURL = window.location.toString()
  const tosPages = terms.map(o => o.tos)
  if (tosPages.includes(thisURL)) return

  // if dev tools are open, jump to stage 5
  const check = checkDevTools()
  if (check.open) return next(5)

  // if presentation has started, do nothing
  const ran = document.querySelector('#tactical-misuse-intro') ||
    document.querySelector('#tm__main')
  if (ran) return

  // otherwise, create the marquee banner
  const banner = document.createElement('div')
  banner.id = 'tactical-misuse-intro'
  banner.style.position = 'fixed'
  banner.style.top = '0'
  banner.style.left = '0'
  banner.style.width = '100vw'
  banner.style.backgroundColor = '#000'
  banner.style.color = '#fff'
  banner.style.fontFamily = 'monospace'
  banner.style.fontSize = '18px'
  banner.style.padding = '10px 0'
  banner.style.zIndex = '9999999'
  banner.style.textAlign = 'center'
  banner.style.overflow = 'hidden'
  banner.style.cursor = 'pointer'

  banner.addEventListener('mouseover', () => {
    banner.style.backgroundColor = '#fff'
    banner.style.color = '#000'
  })

  banner.addEventListener('mouseout', () => {
    banner.style.backgroundColor = '#000'
    banner.style.color = '#fff'
  })

  banner.addEventListener('click', () => {
    banner.remove()
    const check = checkDevTools()
    if (!check.open) {
      document.body.style.cursor = 'pointer'
      next(1)
    } else next(5)
  })

  const marquee = document.createElement('marquee')
  marquee.textContent = 'u can && must hack algorithms NOW'
  marquee.style.whiteSpace = 'nowrap'
  banner.appendChild(marquee)
  document.body.appendChild(banner)

  asciiWave(marquee)
}

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

function checkDevTools () {
  const threshold = 160
  const widthThreshold = window.outerWidth - window.innerWidth > threshold
  const heightThreshold = window.outerHeight - window.innerHeight > threshold
  return {
    orientation: widthThreshold ? 'vertical' : 'horizontal',
    open: !(heightThreshold && widthThreshold) &&
    ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
  }
}

function asciiWave (ele, repeat = true, cb) {
  const ascii = '._,~-:;^/!|*+()=><7[]1?il{}rt%Vx&$ODS@8X'
  const fps = 1000 / 30
  let idx = 0
  const holdTime = 3000
  const originalText = ele.textContent
  const originalHTML = ele.innerHTML
  const waveLength = ascii.length + originalText.length
  const reset = () => { ele.textContent = originalText }
  const update = () => {
    let newText = ''

    if (!repeat) {
      if (idx > waveLength) {
        ele.innerHTML = originalHTML
        if (cb) cb()
        return
      }
    } else if (repeat) {
      if (idx > waveLength + originalText.length) {
        reset()
        if (Number(document.body.dataset.tmstage) > 1) return // stop ascii in other stages
        setTimeout(() => { idx = 0; update() }, holdTime)
        return
      }
    }

    if (idx > waveLength + originalText.length) {
      reset()
      if (repeat) {
        if (document.body.dataset.tmstage !== '1') return
        setTimeout(() => { idx = 0; update() }, holdTime)
      } else {
        ele.innerHTML = originalHTML
        if (cb) cb()
      }
      return
    }

    for (let i = 0; i < originalText.length; i++) {
      const charIdx = (idx - i) % ascii.length
      if (idx > i) {
        if (idx > i + ascii.length) {
          newText += originalText[i]
        } else {
          newText += originalText[i] === ' ' ? ' ' : ascii[Math.max(0, charIdx)]
        }
      } else {
        newText += ' '
      }
    }

    ele.textContent = newText
    idx++
    setTimeout(update, fps)
  }

  update()
}

function debounce (func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

const debouncedScrollCall = debounce(() => {
  if (window.scrollInterval) clearInterval(window.scrollInterval)

  if (document.body.dataset.tmstage === '1') bitCrushScreen()
  else if (document.body.dataset.tmstage === '2') colorBack()
  else if (document.body.dataset.tmstage === '3') colorBack()
}, 200)

function bitCrushScreen (root = document) {
  if (root.querySelectorAll) {
    root.querySelectorAll('*').forEach(element => {
      const isBody = element === document.body || element === document.documentElement
      if (isBody || element.dataset.tmavoid) return

      // apply bit crush styles
      element.style.transition = 'background 1s, color 1s'
      element.style.color = '#fff'
      element.style.fontFamily = 'monospace'
      element.style.borderColor = '#fff'
      element.style.outlineColor = '#fff'

      const css = window.getComputedStyle(element)
      const hasBackgroundImage = css.backgroundImage !== 'none'
      const hasBackgroundColor = css.backgroundColor !== 'rgba(0, 0, 0, 0)' && css.backgroundColor !== 'transparent'
      const mediaElements = ['IMG', 'VIDEO', 'IFRAME', 'PICTURE', 'IMAGE']

      if (hasBackgroundImage || mediaElements.includes(element.tagName)) {
        element.style.filter = 'saturate(1000) grayscale(100%) contrast(10) invert(100%) '
        element.style.imageRendering = 'pixelated'
      } else if (hasBackgroundColor) {
        element.style.backgroundColor = '#000'
      }

      // Loop through the child nodes of each element
      element.childNodes.forEach(node => {
        // Check if the child node is a text node and has non-empty content
        if (node.nodeType === window.Node.TEXT_NODE && node.textContent.trim() !== '') {
          if (Math.random() > 0.8) asciiWave(node)
        }
      })

      if (element.shadowRoot) { // for custom elements
        bitCrushScreen(element.shadowRoot)
      }

      element.dataset.tmavoid = true
      element.classList.add('tm-modified')
    })
  }
}

function colorBack (root = document) {
  if (root.querySelectorAll) {
    root.querySelectorAll('.tm-modified').forEach(element => {
      const isBody = element === document.body || element === document.documentElement
      if (isBody || element.classList.contains('tm-colorized')) return

      // apply bit crush styles
      element.style.color = '#' + Math.floor(Math.random() * 16777215).toString(16)
      element.style.fontFamily = 'inherit'
      element.style.borderColor = 'transparent'
      element.style.outlineColor = 'transparent'

      const css = window.getComputedStyle(element)
      const hasBackgroundImage = css.backgroundImage !== 'none'
      const hasBackgroundColor = css.backgroundColor !== 'rgba(0, 0, 0, 0)' && css.backgroundColor !== 'transparent'
      const mediaElements = ['IMG', 'VIDEO', 'IFRAME', 'PICTURE', 'IMAGE']

      if (hasBackgroundImage || mediaElements.includes(element.tagName)) {
        element.style.filter = 'saturate(1000)'
        element.style.imageRendering = 'pixelated'
      } else if (hasBackgroundColor) {
        element.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16)
      }

      if (element.shadowRoot) { // for custom elements
        colorBack(element.shadowRoot)
      }

      element.classList.add('tm-colorized')
    })
  }
}

function slowScrollDown (speed = 10) {
  window.scrollInterval = setInterval(() => {
    window.scrollBy(0, speed)
  }, 10)
}

function gravityElements (root = document) {
  if (root.querySelectorAll) {
    root.querySelectorAll('.tm-colorized').forEach(element => {
      const isBody = element === document.body || element === document.documentElement
      if (isBody || element.classList.contains('tm-spinnig')) return

      // apply bit crush styles
      element.style.transition = 'all 300s'
      setTimeout(() => {
        const x = Math.floor(Math.random() * 200) - 100
        const y = Math.floor(Math.random() * 200) - 100
        const r = Math.floor(Math.random() * 90) - 45
        const s = Math.floor(Math.random() * 90) - 45
        element.style.transform = `translate(${x}px, ${y}px) skewY(${s}deg) rotate(${r}deg)`
      }, 500)

      if (element.shadowRoot) { // for custom elements
        gravityElements(element.shadowRoot)
      }

      element.classList.add('tm-spinnig')
    })
  }
}

function injectCode (root = document) {
  function escapeHTML (html) {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  if (root.querySelectorAll) {
    root.querySelectorAll('.tm-colorized').forEach(element => {
      const isBody = element === document.body || element === document.documentElement
      if (isBody || element.classList.contains('tm-injected')) return

      if (Math.random() < 0.3) {
        const outerHTML = element.outerHTML
        const pre = document.createElement('pre')
        pre.innerHTML = escapeHTML(outerHTML).substr(0, 100)
        setTimeout(() => element.prepend(pre), Math.random() * 4000 + 1000)
      }

      if (element.shadowRoot) { // for custom elements
        injectCode(element.shadowRoot)
      }

      element.classList.add('tm-injected')
    })
  }
}

// .............................................................................
// .............................................................................
// .............................................................................
// .............................................................................
// ........................................................ PART 1 .............
// .............................................................................

function part1 () {
  const other = document.querySelector('#tm__main')
  if (other) other.remove()

  const slogans = [
    { com: 'google.com', txt: 'organizing the world’s information' },
    { com: 'youtube.com', txt: 'giving everyone a voice' },
    { com: 'facebook.com', txt: 'connecting the world' },
    { com: 'instagram.com', txt: 'capturing and sharing moments' },
    { com: 'bing.com', txt: 'helping you make informed decisions' },
    { com: 'twitter.com', txt: 'giving you a platform to share and access what\'s happening now' },
    { com: 'x.com', txt: 'giving you a platform to share and access what\'s happening now' }
  ]

  const txt = slogans.filter(o => window.location.toString().includes(o.com)).map(o => o.txt)[0]

  const div = document.createElement('div')
  div.id = 'tm__main'
  div.innerHTML = `
    <style>
      #tm__slide {
        border: 0 solid white;
        transition: all 1s;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999999999;
        padding: 2vw;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
        cursor: pointer;
      }

      #tm__cnt {
        transition: all 1s;
        color: #fff;
        font-family: monospace;
        padding: 2vw;
        font-size: 2vw;
        line-height: 2.5vw;
        box-sizing: border-box;
        opacity: 0;
        max-width: 75vw;
      }

      @keyframes colorOscillation {
        0% { color: #ccc; }
        50% { color: #fff; }
        100% { color: #ccc; }
      }

      #tm__cnt a, .tm__next {
        color: #ddd;
        text-decoration: underline;
        cursor: pointer;
        animation: colorOscillation 2s infinite;
      }
      #tm__cnt a, .tm__next:hover { color: #fff }

      .tm__point {
        display: none;
        margin: 0 0.25vw;
      }

      .tm__comment {
        transition: opacity 1s;
        color: #999;
        opacity: 0;
      }

    </style>
    <div id="tm__slide" data-tmavoid="true">
      <span id="tm__cnt" data-tmavoid="true">
        This site pretends to be about "${txt}", but that's just clever misdirection by their PR team. as the internet-age old adage goes:
        <div data-tmavoid="true" style="padding: 2vw; font-size: 3vw; line-height: 3.5vw; display: none;">
          if u're not paying for it, then u're not the customer, u're the <span class="tm__next" data-tmavoid="true">product</span>
        </div>
      </span>
    </div>
  `
  document.body.appendChild(div)

  const slide = div.querySelector('#tm__slide')
  setTimeout(() => { slide.style.cursor = 'pointer' }, 1000)
  slide.addEventListener('click', part1a)

  function part1a () {
    const saying = div.querySelector('#tm__cnt > div')
    if (saying.style.display === 'block') return
    document.body.style.cursor = 'auto'
    slide.style.cursor = 'auto'
    slide.style.borderWidth = '4vw'
    const cnt = div.querySelector('#tm__cnt')
    cnt.style.opacity = '1'
    slide.style.background = 'rgba(0,0,0,0.875)'
    setTimeout(() => {
      saying.style.display = 'block'
      asciiWave(saying, false, () => {
        const product = div.querySelector('.tm__next')
        product.addEventListener('click', part1b)
      })
    }, 4000)
    slide.removeEventListener('click', part1a)
  }

  function part1b () {
    const cnt = document.querySelector('#tm__cnt')
    cnt.style.opacity = 0
    setTimeout(() => {
      cnt.innerHTML = `
      this site is both digital mine && refinement factory. what they sell to their <i data-tmavoid="true">real</i> customers are advanced AI <span class="tm__next" data-tmavoid="true">prediction + manipulation tools</span> which...<br><br>
        <div class="tm__point">+= control ur feed</div>
        <div class="tm__point">+= capture ur attention</div>
        <div class="tm__point">+= anticipate ur actions</div>
        <div class="tm__point">+= modify ur behavior</div>
        <div class="tm__comment" data-tmavoid="true">/* all while bypassing ur awareness */</div>
      `
      cnt.style.opacity = 1
      const product = cnt.querySelector('.tm__next')
      product.addEventListener('click', part1c)
    }, 1000)

    setTimeout(() => {
      cnt.querySelectorAll('.tm__point').forEach((p, i) => {
        setTimeout(() => { p.style.display = 'block' }, i * 500)
        setTimeout(() => asciiWave(p, false), i * 500)
      })
      setTimeout(() => {
        cnt.querySelector('.tm__comment').style.opacity = 1
      }, 4000)
    }, 4000)
  }

  function part1c () {
    const cnt = document.querySelector('#tm__cnt')
    cnt.style.opacity = 0
    const TOS = terms.filter(o => window.location.toString().includes(o.com)).map(o => o.tos)[0]
    setTimeout(() => {
      cnt.innerHTML = `
      these are among the most lucrative in the surveillance capitalist markets
      <br><br>
      trained on ur data, to exploit u, with ur <a target="_blank" data-tmavoid="true">permission</a>
      <br><br>
      these <span class="tm__next" data-tmavoid="true">algorithms</span> are deployed on all of us in insidious, unethical (yet legal) ways
      `
      cnt.style.opacity = 1
      const tos = cnt.querySelector('a')
      // tos.setAttribute('href', TOS)
      tos.addEventListener('click', (event) => {
        event.preventDefault()
        window.open(TOS, 'Terms of Service', 'left=100,top=100,width=450,height=320')
      })
      const product = cnt.querySelector('.tm__next')
      product.addEventListener('click', part1d)
    }, 1000)
  }

  function part1d () {
    slide.style.background = 'rgba(255, 255, 255, 0.8)'

    Array.from(document.body.children).forEach(ele => {
      if (ele.id !== 'tm__main') { ele.style.filter = 'blur(10px)' }
    })
    const cnt = document.querySelector('#tm__cnt')
    cnt.style.opacity = 0
    setTimeout(() => {
      document.querySelector('#tm__main').remove()
      next(2) // move onto part 2
    }, 1000)
  }
}

// .............................................................................
// .............................................................................
// .............................................................................
// .............................................................................
// ........................................................ PART 2 .............
// .............................................................................

function part2 () {
  const other = document.querySelector('#tm__main')
  if (other) other.remove()

  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.left = '0'
  div.style.top = '0'
  div.style.zIndex = '999999999'
  div.id = 'tm__main'
  div.innerHTML = `
    <style>
      #tm__slide {
        transition: all 1s;
        position: fixed;
        top: 0;
        left: 0;
        padding: 2vw;
        background: rgba(255,255,255,0.8);
        border: 4vw solid white;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
      }

      #tm__cnt {
        transition: all 1s;
        color: #000;
        font-family: monospace;
        padding: 2vw;
        font-size: 2vw;
        line-height: 2.5vw;
        box-sizing: border-box;
        opacity: 0;
      }

      @keyframes colorOscillation {
        0% { color: #888; }
        50% { color: #000; }
        100% { color: #888; }
      }

      #tm__cnt a, .tm__next {
        color: #888;
        text-decoration: underline;
        cursor: pointer;
        animation: colorOscillation 2s infinite;
      }

      #tm__cnt a, .tm__next:hover { color: #000 }

    </style>
    <div id="tm__slide">
      <span id="tm__cnt">
        but the data barons don't own the web, they've simply built panopticon[ic] walls around parts of our digital garden
        <br><br>the web is still the people's platform
        <br><br>we can change it, we can mold it
        <br>we can start by <span class="tm__next">hacking</span> these walls
      </span>
    </div>
  `
  div.dataset.tmnocrack = true
  document.body.appendChild(div)

  setTimeout(() => {
    const cnt = div.querySelector('#tm__cnt')
    cnt.style.opacity = 1
  })

  const product = div.querySelector('.tm__next')
  product.addEventListener('click', part2b)

  function part2b () {
    const cnt = document.querySelector('#tm__cnt')
    cnt.style.opacity = 0

    setTimeout(() => {
      const slide = document.querySelector('#tm__slide')
      slide.style.background = 'rgba(255, 255, 255, 0)'
      slide.style.borderWidth = 0
    }, 1000)

    setTimeout(() => {
      Array.from(document.body.children).forEach(ele => {
        if (ele.style.filter === 'blur(10px)') {
          ele.style.transition = 'filter 1s'
        }
        setTimeout(() => { ele.style.filter = 'blur(0px)' }, 100)
      })
    }, 2000)

    setTimeout(() => {
      document.querySelector('#tm__main').remove()
      next(3)
    }, 3000)
  }
}

// .............................................................................
// .............................................................................
// .............................................................................
// .............................................................................
// ........................................................ PART 3 .............
// .............................................................................

function part3 () {
  const other = document.querySelector('#tm__main')
  if (other) other.remove()

  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.left = '0'
  div.style.top = '0'
  div.style.zIndex = '999999999'
  div.id = 'tm__main'
  div.innerHTML = `
    <style>
      #tm__slide {
        transition: all 1s;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999999999;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
      }

      #tm__cnt {
        transition: all 1s;
        color: #000;
        font-family: monospace;
        padding: 2vw;
        font-size: 2vw;
        line-height: 2.5vw;
        box-sizing: border-box;
        background: white;
        width: 100vw;
        opacity: 0;
      }

      @keyframes colorOscillation {
        0% { color: #888; }
        50% { color: #000; }
        100% { color: #888; }
      }

      #tm__cnt a, .tm__next {
        color: #888;
        text-decoration: underline;
        cursor: pointer;
        animation: colorOscillation 2s infinite;
      }

      #tm__cnt a, .tm__next:hover { color: #000 }

    </style>
    <div id="tm__slide">
      <span id="tm__cnt">
        we can find cracks in the code, exploit them && take the power back
        <br>
        reclaim some agency && control ...at least for a moment
        <br>
        <span class="tm__next">would u like to try?</span>
      </span>
    </div>
  `
  document.body.appendChild(div)

  setTimeout(() => {
    const cnt = document.querySelector('#tm__cnt')
    cnt.style.opacity = 1
    const product = div.querySelector('.tm__next')
    product.addEventListener('click', part3b)
  }, 3000)

  setTimeout(() => {
    injectCode()
  }, 4000)

  function part3b () {
    const cnt = document.querySelector('#tm__cnt')
    cnt.style.opacity = 0
    const msg = (navigator.platform.toUpperCase().indexOf('MAC') >= 0)
      ? 'Fn + F12 keys' : 'F12 key'
    setTimeout(() => {
      cnt.innerHTML = `
        built into ur browser are Web Developer Tools, these exist to aid the coders who make these websites.
        but we can misuse these tools in creative ways. press the ${msg} on ur keyboard.
      `
      cnt.style.opacity = 1
    }, 1000)

    window.waitingForConsole = setInterval(() => {
      const dev = checkDevTools()
      if (dev.open) {
        clearInterval(window.waitingForConsole)
        next(4)
      }
    }, 500)
  }
}

// .............................................................................
// .............................................................................
// .............................................................................
// .............................................................................
// ........................................................ PART 4 .............
// .............................................................................

function part4 () {
  const other = document.querySelector('#tm__main')
  if (other) other.remove()

  const dev = checkDevTools()
  const introTxt = dev.orientation === 'horizontal'
    ? 'The panel below contains' : 'This panel off to the side contains'

  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.right = '10px'
  div.style.bottom = '10px'
  div.style.zIndex = '999999999'
  div.id = 'tm__main'
  div.innerHTML = `
    <style>

      #tm__nfo {
        background: #000;
        color: #fff;
        font-family: monospace;
        padding: 30px;
        font-size: 18px;
        line-height: 22px;
        width: 50vw;
      }

      @keyframes colorOscillation {
        0% { color: #888; }
        50% { color: #fff; }
        100% { color: #888; }
      }

      #tm__refresh {
        color: #888;
        text-decoration: underline;
        cursor: pointer;
        animation: colorOscillation 2s infinite;
      }

      #tm__refresh:hover { color: #888 }

    </style>
    <div id="tm__nfo">
      ${introTxt} the "Web Developer Tools". Click on the 3 dots icon (top-right of the panel) to change where the panel is docked, && the gear icon to change the panel's settings. Let's <span id="tm__refresh">refresh</span> this page so that we can start with a clean slate.
    </div>
  `
  document.body.appendChild(div)

  div.querySelector('#tm__refresh').addEventListener('click', () => window.location.reload())
}

// .............................................................................
// .............................................................................
// .............................................................................
// .............................................................................
// ........................................................ PART 5 .............
// .............................................................................

function part5 () {
  const other = document.querySelector('#tm__main')
  if (other) other.remove()

  const b = /Firefox/.test(navigator.userAgent) ? 'Firefox' : /Chrome/.test(navigator.userAgent) ? 'Chrome' : 'Other'

  const dev = checkDevTools()
  const introTxt = dev.orientation === 'horizontal'
    ? 'Below u\'ll find' : 'On the side here u\'ll find'

  const ins = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? 'Elements' : 'Inspector'
  const firstPassage = `${introTxt} the Web Developer Tools, intended to be used by the coders who made this site to test/debug it; we can && must tactically misuse these tools to reclaim agency from the data barons.
  <br><br>
  choose ur hack vector: <a data-link="inspector.0">${ins}</a>, <a data-link="console.0">Console</a>, <a data-link="network.0">Network</a>
  <br><br>
  this only just scratches the surface, but we can <a data-link="eof.0">go deeper</a>`

  let textToLoad = firstPassage
  storage.local.get(['cnsl'], function (result) {
    if (result.cnsl) textToLoad = loadCnt(result.cnsl)
  })

  function setupLinks () {
    document.querySelector('#tm__nfo').querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => loadCnt(link.dataset.link))
    })

    const codeExamples = [
      '<pre class="cm-s-netizen" role="presentation"><span role="presentation"><span class="cm-variable">document</span>.<span class="cm-property">body</span>.<span class="cm-property">style</span>.<span class="cm-property">transform</span> <span class="cm-operator">=</span> <span class="cm-string">\'rotate(180deg)\'</span></span></pre>',
      '<pre class="cm-s-netizen" role="presentation"><span role="presentation"><span class="cm-variable">document</span>.<span class="cm-property">body</span>.<span class="cm-property">style</span>.<span class="cm-property">filter</span> <span class="cm-operator">=</span> <span class="cm-string">\'saturate(1000)\'</span></span></pre>',
      '<pre class="cm-s-netizen" role="presentation"><span role="presentation"><span class="cm-variable">document</span>.<span class="cm-property">body</span>.<span class="cm-property">style</span>.<span class="cm-property">filter</span> <span class="cm-operator">=</span> <span class="cm-string">\'invert()\'</span></span></pre>',
      '<pre class="cm-s-netizen" role="presentation"><span role="presentation"><span class="cm-variable">document</span>.<span class="cm-property">body</span>.<span class="cm-property">style</span>.<span class="cm-property">filter</span> <span class="cm-operator">=</span> <span class="cm-string">\'hue-rotate(90deg)\'</span></span></pre>',
      '<pre class="cm-s-netizen" role="presentation"><span role="presentation"><span class="cm-variable">document</span>.<span class="cm-property">body</span>.<span class="cm-property">style</span>.<span class="cm-property">transform</span> <span class="cm-operator">=</span> <span class="cm-string">\'scaleX(0.25)\'</span></span></pre>'
    ]
    const code = document.querySelector('#cli__code')
    const cbtn = document.querySelector('#tm__script')
    if (code && cbtn) {
      cbtn.addEventListener('click', () => {
        let idx = Number(code.dataset.index)
        idx++
        if (idx >= codeExamples.length) idx = 0
        code.dataset.index = idx
        code.innerHTML = codeExamples[idx]
      })
    }
  }

  function loadCnt (type) {
    if (!type) return
    storage.local.set({ cnsl: type })

    const a = type.split('.')
    const dev = checkDevTools()
    const side = dev.orientation === 'horizontal' ? 'below' : 'next to'
    const site = window.location.toString().split('.').filter(s => !s.includes('http') && !s.includes('com'))[0]
    const ig = site === 'instagram'
    const qa = site === 'quora'
    const bg = site === 'bing'
    const fb = site === 'facebook'
    const ins = b === 'Firefox' ? 'Inspector' : 'Elements'
    const css = b === 'Firefox' ? 'Rules' : 'Styles'
    const data = {
      inspector: [
        `click on "${ins}"; this tab pulls back the digital curtain, it allows us not only to see but methodically disect + modify the code behind this website.
        <br><br>
        click the inspector arrow (⇱) icon (top-left of the panel) to activate it, then hover over the website to choose an element to inspect, once clicked u can modify this elements code using the ${ins} tab or the ${css} sub-tab ${side} it. changes are not permanent (u can refresh anytime to start anew), so poke + prod + hack.
        <br><br>
        insights gained through experimentation lead to <a data-link="inspector.1">more tactical modifications</a>.`,
        `the inspector can be used to hack around the "dark patterns" of UI/UX designed to keep u coming back && handing over more data. some sites, like ${ig ? 'this one' : '<a href="https://instagram.com">Instagram</a>'}, prevent u from right-click saving images, other sites like ${qa ? 'this one' : '<a href="https://www.quora.com/What-does-surveillance-capitalism-mean">Quora</a>'} force u to hand over identifiable information before u can read an otherwise public post... ${ig ? 'but we can <a data-link="inspector.2">tactically hack</a> around this' : qa ? 'but we can <a data-link="inspector.3">tactically hack</a> around this' : `visit either of those sites + open the ${ins} again && i'll explain how to tactically hack around this`}.`,
        `use the inspector icon (⇱) to select an image on ur instagram feed (u must be logged in). the ${ins} tab will jump to a <code style="color:#75bfff">&ltdiv&gt;</code> element in the HTML code, just above it should be another <code style="color:#75bfff">&ltdiv&gt;</code>, click on it's triangle to reveal the <code style="color:#75bfff">&ltimg&gt;</code> element inside. hover over the img's <code style="color:#ff7de9">src</code> attribute to reveal the image's URL. Click on it (or double click to select it then copy+paste) to view the file in a new tab. u can now right-click save it.`,
        `Quora lets u read the first post, but click on one of the "Related questions" (top right of the page) once or twice && u will be blocked by a screen coercing u into revealing ur identity + handing over more data. click the inspector icon (⇱) to activiate it && then click/select the dark blurred background of the login screen. Then ${side} the selected HTML code u'll see some CSS code in the ${css} sub-tab. There should be a CSS property for this element called <code style="color:#75bfff">display</code>, with a value of <code style="color:#ff7de9">flex</code>, click on the value && change it to <code style="color:#ff7de9">none</code>. Once the screen is gone, we'll need to remove the blur effect, notice that a couple of elements above the selected <code style="color:#75bfff">&ltdiv&gt;</code> there's another with a <code style="color:#b98eff">blur(3px)</code>, click on that, then in the ${css} sub-tab un-check the box next to <code style="color:#75bfff">filter: blur(3px)</code>. Now we can read, but we can not scroll the page. To fix this, scroll to the top of the HTML code in the ${ins} && click on the <code style="color:#75bfff">&ltbody&gt;</code> element. Then in the ${css} sub-tab un-check the box next to CSS code <code style="color:#75bfff">overflow: hidden</code>.`
      ],
      console: [
        `click on "Console"; this tab displays any log or error messages from the site's JavaScript code. it can also be used to (temporarily) modify the site in powerful + programatic ways. ${fb || ig ? 'this site of course would prefer u didn\'t do that, hence the discouraging message at the top, but we\'re not here to play by their rules' : ''}. clear the console by clicking the ${b === 'Firefox' ? 'Trash (🗑) icon' : 'Clear (⊘) icon'}. Then copy+paste && "Enter" the following code into the Console (<i style="opacity:0.7">if this is ur first time pasting code into the Console, u'll need to first type/enter: allow pasting</i>):<br>
        <div id="cli__code" data-index="0"><pre role="presentation"><span role="presentation"><span class="cm-variable">document</span>.<span class="cm-property">body</span>.<span class="cm-property">style</span>.<span class="cm-property">transform</span> <span class="cm-operator">=</span> <span class="cm-string">'rotate(180deg)'</span></span></pre></div>
        <a id="tm__script">click here for another script</a>.
        <br>
        refresh this page to begin anew.
        <br><br>
        there are so many more scripts, beyond these digital <a href="https://en.wikipedia.org/wiki/D%C3%A9tournement" target="_blank">détournement</a> hacks, which we can run to <a data-link="console.1">tactically misuse</a> these platforms.`,
        'we can also run scripts which modify our feeds in ways that free us from algorithmic influence by, for example, removing <a href="https://tacticalmisuse.net/scripts/#Twitter%20demetricator" target="_blank">metrics</a>, "<a target="_blank" href="https://tacticalmisuse.net/scripts/#remove%20Instagram%20%22suggestions%22">recommended</a>" posts, <a target="_blank" href="https://tacticalmisuse.net/scripts/#remove%20Instagram%20ads">ads && other trackers</a> && <a target="_blank" href="https://tacticalmisuse.net/scripts/#chronological%20Instagram%20feed">reordering the feeds themselves</a>. We can also combine/package them as <a href="https://tacticalmisuse.net/how/add-ons/" target="_blank">add-ons/extensions</a> (just like this manifesto) to even greater effect. for more scripts visit <a href="https://tacticalmisuse.net/scripts/" target="_blank">https://tacticalmisuse.net/scripts/</a>'
      ],
      network: [
        `click on "Network"; this tab monitors all the data traveling between ur browser && the site's server. some of this data might be obvious (all the the code && media files that make up the site) other bits of data might be less obvious. click on any of the data packets to investigate it further (if u don't see any listed here refresh the page with this tab open)
        <br><br>
        exploration here can lead to <a data-link="network.1">tactical insights</a>.`,
        `by observing which/when packets were leaving (POST) the browser, a privacy researcher noticed some time ago that Facebook was recording everything users typed into a message box or comment field even if (or especially when) they decided not to post it. a discovery which was later confirmed when Facebook published a paper on what they called "<a href="https://www.theatlantic.com/technology/archive/2013/04/71-of-facebook-users-engage-in-self-censorship/274982/" target="_blank">self-censorship</a>". On ${bg ? 'this site' : '<a href="https://bing.com">Bing</a>'} u might notice some other ${bg ? '<a data-link="network.2">mischievous network traffic</a>' : 'mischievous network traffic'}.`,
        `when Bing first loads, the Network tab is flooded with data packets. lets remove those out by clicking the ${b === 'Firefox' ? 'Trash (🗑) icon' : 'Clear (⊘) icon'}. at this point the Network tab should remain quiet unless u click or hover over some interactive component of the website. however, u'll notice that on this site, even the most subtle movement anywhere on the page will POST data to Microsoft. it turns out that Bing <a href="https://github.com/microsoft/mouselog" target="_blank">tracks all ur mouse movements</a> on the site, at first to see if they could use this data to "<a href="https://www.wsj.com/articles/clues-to-parkinsons-disease-from-how-you-use-your-computer-1527600547" target="_blank">predict</a>" which users have neurodegenerative disorders, like Parkinson’s disease. Those are valuable "predictions", who might the data barons choose to sell ur medical future to?`
      ],
      eof: [
        `u do not need to be an expert hacker to reclaim ur agency<br>
        u can && must hack algorithms now<br>
        make tactical misuse a part of ur everyday practice<br>
        visit <a href="https://tacticalmisuse.net">https://tacticalmisuse.net</a> to learn more`
      ]
    }

    document.querySelector('#tm__nfo').innerHTML = `
      <div id="tm__bck">⇠</div>
      ${data[a[0]][a[1]]}
    `

    document.querySelector('#tm__bck').addEventListener('click', () => {
      storage.local.set({ cnsl: null })
      document.querySelector('#tm__nfo').innerHTML = firstPassage
      setupLinks()
    })

    setupLinks()
  }

  // ...........

  const div = document.createElement('div')
  div.style.position = 'fixed'
  div.style.right = '10px'
  div.style.bottom = '10px'
  div.style.zIndex = '999999999'
  div.id = 'tm__main'
  div.innerHTML = `
    <style>
      #tm__nfo {
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-family: monospace;
        padding: 30px;
        font-size: 16px;
        line-height: 19px;
        width: 60vw;
      }

      #tm__nfo:hover {
        background: rgba(0, 0, 0, 1);
      }

      .CodeMirror.cm-s-netizen {
        background: rgba(35, 35, 39, 0.5)
      }

      #tm__nfo:hover .CodeMirror.cm-s-netizen {
        background: rgba(35, 35, 39, 1)
      }

      @keyframes colorOscillation {
        0% { color: #888; }
        50% { color: #fff; }
        100% { color: #888; }
      }

      #tm__nfo a {
        color: #888;
        text-decoration: underline;
        cursor: pointer;
        animation: colorOscillation 2s infinite;
      }

      #tm__nfo a:hover { color: #888 }

      #tm__bck {
        cursor: pointer;
        font-size: 38px;
        margin-bottom: 9px;
        margin-top: -21px;
      }

      #cli__code .cm-variable { color: #b98eff; }

      #cli__code .cm-property { color: #86de74; }

      #cli__code .cm-operator { color: #cfcbc4; }

      #cli__code .cm-string { color: #b98eff; }

      #tm__script { user-select: none; }

    </style>
    <div id="tm__nfo">
      ${textToLoad}
    </div>
  `
  document.body.appendChild(div)

  setupLinks()

  window.checkConsole = setInterval(() => {
    const check = checkDevTools()
    if (!check.open) {
      const main = document.querySelector('#tm__main')
      if (main) main.remove()
      clearInterval(window.checkConsole)
      setTimeout(() => init(), 100)
    }
  }, 500)
}

window.addEventListener('load', init)
window.addEventListener('scroll', debouncedScrollCall)
init()
