const fs = require('fs')

const csv = fs.readFileSync(`${__dirname}/amazon_trademarked_brands.csv`, 'utf8')
const arr = csv.split('\n').map(s => {
  const a = s.split(',')
  return `"${a[0].toUpperCase()}"`
})

fs.writeFileSync('amazon.txt', arr.join(', '))
