const path = require('path')
const moment = require('moment')
const Nameday = require('./lib/nameday')
const nameday = new Nameday()

nameday.loadFile(path.join(__dirname, 'names.json'))
nameday.sendNoticeLetter('kissgab@gmail.com', 7)