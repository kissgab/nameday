'use strict';

process.env.IS_CLI = true
const path = require('path')
const moment = require('moment')
const Nameday = require('./lib/nameday')
const nameday = new Nameday()
const nodecron = require('node-cron')

nodecron.schedule('0 6 * * *', () => {
  nameday.loadFile(path.join(__dirname, 'names.json'))
  nameday.sendNoticeLetter('kissgab@gmail.com', 7)
}, true)
