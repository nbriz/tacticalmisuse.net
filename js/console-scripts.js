/* global Netitor, nn */
const ne = new Netitor({
  ele: '#code', language: 'javascript', readOnly: true, theme: 'moz-dark'
})
const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
const snippets = document.querySelector('#snippets')
const copy = document.querySelector('#copy')
const nfo = document.querySelector('#nfo')
const edu = document.querySelector('#edu')

const scripts = {
  'pick-one': {
    info: '...',
    code: ''
  },
  'remove reTweets': {
    info: 'this snippet removes all the retweet buttons from a twitter feed. <a href="https://www.science.org/doi/10.1126/science.aap9559" target="_blank">studies</a> have shown that Twitter\'s retweet button heavily contributes to the spread of disinformation online, many have <a href="https://www.theatlantic.com/technology/archive/2018/10/twitter-should-kill-retweet/574321/" target="_blank">suggested removing it</a>, but so long as it triggers engagement, we\'re unlikely to see the platform make this change, despite the harm it\'s doing to our society.',
    code: `const reTweets = '.css-175oi2r.r-1kbdv8c.r-18u37iz.r-1wtj0ep.r-1ye8kvj.r-1s2bzr4'
document.querySelectorAll(reTweets).forEach(reTweet => {
    reTweet.children[1].style.display = 'none'
})`
  },
  'Twitter demetricator': {
    info: 'this script will remove all the social metrics from tweets in your twitter feed, similar to the piece <a href="https://bengrosser.com/projects/twitter-demetricator/" target="_blank">Twitter Demetricator</a> by artist Ben Grosser. <a href="https://journals.sagepub.com/doi/abs/10.1177/0956797616645673" target="_blank">studies</a> have shown that the number of likes/hearts/etc posts have on social media have a measurable effect on our brain. these are of course designed to maximize engagement (&& thus profit) for the platforms, but they may not always have the best effect on our mental health.',
    code: 'document.querySelectorAll(\'.r-1k6nrdp\').forEach(num => num.style.display = \'none\')'
  },
  'infinite scroll': {
    info: 'many of these scripts are meant to be applied to social feeds, but these feeds generally appear/build up as u scroll. this means posts which appear from scrolling past the last post to have been manipulated by any given code snippet will not be effected. this snippet of code can be used to automatically scroll through a page. u can stop the auto-scrolling by running <code>clearTimeout(scrolltimer)</code>',
    code: `function infiniteScroll () {
    window.scrollBy(0,1);
    scrolltimer = setTimeout(infiniteScroll,10);
}
infiniteScroll()`
  },
  'remove Instagram ads': {
    info: 'this snippet removes all "sponsored" posts from your Instagram feed. a simple gesture, yet a consequential one, hyper-targeting us w/ads is at the center of Instagram\'s business model.',
    code: `document.querySelectorAll('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 article').forEach(a => {
    if (a.querySelector('.x1fhwpqd.x132q4wb.x5n08af')) a.remove()
})`
  },
  'remove Instagram "suggestions"': {
    info: 'this snippet removes all "Suggested for you" posts from your Instagram feed. a simple gesture, yet a consequential one. "suggestions" on sites like Instagram && YouTube are designed to keep u hooked + scrolling. what\'s worse is that these algorithms have been <a href="https://dl.acm.org/doi/abs/10.1145/3351095.3372879?download=true" target="_blank">studied</a> to have all sorts of unintended <a href="https://www.theguardian.com/technology/2018/feb/02/how-youtubes-algorithm-distorts-truth" target="_blank">side effects</a> beyond just hijacking our attention.',
    code: `document.querySelectorAll('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x1tu3fi.x3x7a5m.x10wh9bi.x1wdrske.x8viiok.x18hxmgj').forEach(a => {
    a.parentElement.parentElement.parentElement.remove()
})`
  },
  'chronological Instagram feed': {
    info: 'this script removes all ads as well as suggested posts from ur Instagram feed && re-orders the remaining posts chronologically. in the earliest days of social media our feeds were chronological. later, the data barons realized that they could maximize engagement && even influence our behavior by curating our feeds in particular ways. in addition to making them richer by making us even more hooked, Meta (aka Facebook, Instagram, etc) discovered in 2014 that they could even <a href="https://www.theguardian.com/technology/2014/jun/30/facebook-emotion-study-breached-ethical-guidelines-researchers-say" target="_blank">manipulate our emotions</a>.',
    code: `const feed = document.querySelector('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > div > div')
const chronological = [...feed.children]
  .filter(a => !a.querySelector('.x1fhwpqd.x132q4wb.x5n08af'))
  .filter(a => !a.querySelector('.x1lliihq.x1plvlek.xryxfnj.x1n2onr6.x193iq5w.xeuugli.x1fj9vlw.x13faqbe.x1vvkbs.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1i0vuye.xvs91rp.xo1l8bm.x5n08af.x1tu3fi.x3x7a5m.x10wh9bi.x1wdrske.x8viiok.x18hxmgj'))
  .sort((a, b) => {
    const d2 = (new Date(b.querySelector('time').dateTime).getTime() || -Infinity)
    const d1 = (new Date(a.querySelector('time').dateTime).getTime() || -Infinity)
    return d2 - d1
  })
feed.innerHTML = ''
chronological.forEach(post => feed.appendChild(post))`
  },
  'randomized Instagram feed': {
    info: 'this script randomizes the order of the posts on ur Instagram feed. in the earliest days of social media our feeds were chronological. later, the data barons realized that they could maximize engagement && even influence our behavior by curating our feeds in particular ways. in addition to making them richer by making us even more hooked, Meta (aka Facebook, Instagram, etc) discovered in 2014 that they could even <a href="https://www.theguardian.com/technology/2014/jun/30/facebook-emotion-study-breached-ethical-guidelines-researchers-say" target="_blank">manipulate our emotions</a>.',
    code: `feed = document.querySelector('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x1qjc9v5.x1oa3qoh.x1nhvcw1 > div > div')
for (let i = feed.children.length; i >= 0; i--) {
  const randomPost = feed.children[Math.random() * i | 0]
  feed.appendChild(randomPost)
}`
  },
  'sans-Google results': {
    info: `this script will remove Google services from Google search results. "Have you noticed that Google search results often turn up a lot of Google content at the top?", investigative journalists at the Markup revealed that <a href="https://themarkup.org/google-the-giant/2020/07/28/google-search-results-prioritize-google-products-over-competitors" target="_blank">
    41% of the first page of Google search results is taken up by Google products</a>. this has become the subject anti-trust cases against Google.`,
    code: `const results = document.querySelector('#rso')
results.querySelectorAll('.hlcw0c').forEach(r => {
  const a = r.querySelector('a')
  if (a && a.href.includes('google')) r.remove()
})
results.querySelectorAll('.MjjYud').forEach(r => {
  const a = r.querySelector('a')
  if (a && a.href.includes('google')) r.remove()
})`
  },
  'sans-Amazon results': {
    info: 'this script will remove Amazon brand (including private-label brands) products from Amazon search results. "Amazon has registered more than 150 private-label brands with the U.S. Patent and Trademark Office and carries hundreds of thousands of items from these house brands on its site. A recent <a href="https://themarkup.org/amazons-advantage/2021/10/14/amazon-puts-its-own-brands-first-above-better-rated-products" target="_blank">investigation</a> by The Markup found that the online shopping behemoth often gives its own brands and exclusive products a leg up in search results over better-rated competitors." this script uses a <a href="https://github.com/the-markup/investigation-amazon-brands/tree/master/data/output/datasets/trademarks" target="_blank">database of Amazon brands</a> created by investigative journalists at the Markup.',
    code: `const brands = ["10.OR", "206 COLLECTIVE", "365 BY WHOLE FOODS MARKET", "365 EVERY DAY VALUE", "A FOR AWESOME", "A MADE FOR KINDLE", "AFA", "AFA AUTHENTIC FOOD ARTISAN", "AFTERTHOUGHT", "ALEXA", "ALLEGRO", "ALWAYS HOME", "AMAZING BABY", "AMAZON", "AMAZON BASIC CARE", "AMAZON BASICS", "AMAZON CHIME", "AMAZON COMMERCIAL", "AMAZON DASH", "AMAZON ECHO", "AMAZON EDV", "AMAZON ELEMENTS", "AMAZON ENGLISH", "AMAZON ESSENTIALS", "AMAZON GAME STUDIOS", "AMAZON PHARMACY", "AMAZON SPHERES", "AMAZON TAP", "AMAZON.COM", "AMAZONFRESH", "ARABELLA", "ARTHUR HARVEY", "AZALEA", "BE", "BELEI", "BERRY CHANTILLY", "BLINK", "BLOOM STREET", "C/O", "CAMP MOONLIGHT", "CANDY ISLAND CONFECTIONS", "CELEBRATION CAFFE", "CHEDDAR CHICKS", "CITY BUTCHER", "COASTAL BLUE", "COMMON CASUALS", "COMMON DISTRICT", "COMPASS ROAD", "COOPER JAMES", "CORE 10", "COUNTDOWN TO ZERO", "CREATIVE GALAXY", "D R", "DAILY RITUAL", "DAISY DRIVE", "DAYANA", "DENALI", "DENIM BLOOM", "DUE EAST APPAREL", "EERO", "FAIRFAX", "FIND.", "FIRE", "FLOODCRAFT BREWING COMPANY", "FLYING ACE", "FRANKLIN & FREEMAN", "FRESH FIELDS", "GEORGIA STYLE W.B. WILLIAMS BRAND PEACH SALSA #1 SELECT", "GOODTHREADS", "HALO", "HAPPY BELLY", "HOUSE OF BOHO", "HS HOUSE & SHIELDS CLOTHING COMPANY", "ISLE BAY", "JAMES & ERIN", "JUMP CLUB", "KAILEE ATHLETICS", "KINDLE", "KITZY", "LARK & RO", "LEAGUE OF OUTSTANDING KIDS LOOK", "LEMON LABEL PAPER SUPPLY", "LILY PARKER", "M X G", "MADE FOR AMAZON", "MADELINE KELLY", "MADEMARK", "MAE", "MAMA BEAR", "MIA NOIR", "MINT LILAC", "MOON AND BACK", "MOUNTAIN FALLS", "MOVIAN", "MR BEAMS", "NATURE'S WONDER", "NIGHT SWIM", "NINJA SQUIRREL", "NOD BY TUFT&NEEDLE", "NUPRO", "OBSIDIAN", "OCEAN BLUES", "ONE WINE", "ORCHID ROW", "OUTERWEAR INDEX CO.", "P2N", "PAINTED HEART", "PINZON", "PLUMBERRY", "PRESTO!", "RAVENNA HOME", "READY WHEN YOU ARE", "READYVOLT", "REBELLION", "REPLENISH", "REVLY", "RING", "RIVET", "ROMANTIC DREAMERS", "SCOUT + RO", "SCUBA SNACKS", "SEEDUCTION", "SEKOA", "SERIOUSLY TASTY", "SILLY APPLES", "SOCIETY NEW YORK", "SOLIMO", "SPOTTED ZEBRA", "SPROUT STAR", "STARKEY SPRING WATER", "STONE & BEAM", "STRATHWOOD", "SUITE ALICE", "THE ESTABLISHMENT", "THE PLUS PROJECT", "THE PORTLAND PLAID CO", "THE SLUMBER PROJECT", "THIRTY FIVE KENT", "TOES IN A BLANKET", "TOVESS", "TRUITY", "VOX", "WAG", "WELLSPRING", "WHOLE FOODS", "WICKEDLY PRIME", "WONDER BOUND", "WOOD PAPER COMPANY", "YOURS TRULY", "ZANIE KIDS", "ZAPPOS", "GABRIELLA ROCHA", "BOUQUETS", "VIGOTTI", "TYPE Z", "LASSEN", "FITZWELL", "RSVP", "STRATHWOOD"]
const results = document.querySelectorAll('[data-component-type="s-search-result"]')
const amazon = [...results].filter(r => {
  const title = r.querySelector('h2').textContent.toUpperCase()
  let amazon = false
  for (let i = 0; i < brands.length; i++) {
    if (title.includes(brands[i])) {
      amazon = true; break
    }
  }
  return amazon
})
for (let i = 0; i < amazon.length; i++) amazon[i].remove()`
  },
  'spin elements': {
    info: 'we can also write all sorts of playful scripts for <a href="https://en.wikipedia.org/wiki/D%C3%A9tournement" target="_blank">détournement</a> hacks, this code will make all the "div" elements on the page spin',
    code: `document.querySelectorAll('div').forEach(div => {
  div.style.transition = '300s all linear'
  div.style.transform = 'rotate(1000deg)'
})`
  },
  'color clicker': {
    info: 'we can also write all sorts of playful scripts for <a href="https://en.wikipedia.org/wiki/D%C3%A9tournement" target="_blank">détournement</a> hacks, this code will change the color of every element you click on (while also preventing the default click behavior)',
    code: `window.addEventListener('click', (e) => {
  e.preventDefault()
  const r = Math.random() * 255
  const g = Math.random() * 255
  const b = Math.random() * 255
  e.target.style.backgroundColor = \`rgb(\${r}, \${g}, \${b})\`
}, true)`
  }
}

function copyLink () {
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

function loadScript (name) {
  ne.code = scripts[name].code
  nfo.innerHTML = scripts[name].info
  window.location.hash = name
}

copy.addEventListener('click', copyLink)
snippets.addEventListener('change', () => loadScript(snippets.value))

ne.on('edu-info', (eve) => {
  if (eve.nfo) {
    ne.spotlight(eve.line)
    edu.innerHTML = `${eve.nfo.keyword.html}: ${eve.nfo.description.html}`
  }
})

ne.on('cursor-activity', (eve) => {
  edu.innerHTML = '<i>double-click bits of code bove for more info<i>'
  ne.spotlight('clear')
})

window.addEventListener('load', () => {
  for (const key in scripts) {
    if (key !== 'pick-one') {
      const opt = document.createElement('option')
      opt.textContent = key
      opt.value = key
      snippets.appendChild(opt)
    }
  }

  if (window.location.hash) {
    const name = decodeURIComponent(window.location.hash.substr(1))
    loadScript(name)
  }

  nn.getAll('.hotkey').forEach(ele => { ele.innerHTML = hotkey })

  nn.get('#close-info').on('click', () => {
    nn.get('#info').css({ display: 'none' })
  })

  nn.get('#info-btn').on('click', () => {
    nn.get('#info').css({ display: 'block' })
  })
})
