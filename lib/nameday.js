'use strict';

const nodemailer = require('nodemailer')
const moment = require('moment')
const _ = require('lodash')

function Nameday() {
  this.nameIndex = {}
}

Nameday.prototype.loadFile = function (filename) {
  var names = require(filename)
  this.nameIndex = {}
  
  _.forEach(names, (item) => {
    this.nameIndex[item.date] = item.names
  })
}

Nameday.prototype.getNamesForDate = function (momentDate) {
  var idx = momentDate.format('MM.DD')
  var isLeapYear = momentDate.isLeapYear();
  var modDate
  
  if (isLeapYear && idx === '02.24') {
    return ['Szökőnap']
  }

  if (isLeapYear && momentDate.format('MM') === '02' && momentDate.format('DD') > "24") {
    modDate = moment(momentDate).subtract(1, 'days')
    idx = modDate.format('MM.DD')
  }
  
  if (this.nameIndex.hasOwnProperty(idx)) {
    return this.nameIndex[idx]
  }
  
  return []
}

Nameday.prototype.sendNoticeLetter = function (toEmail, periodInDays) {
  var lines = []
  var names
  var formattedDate
  var date = moment()
  
  for (var i = 0; i < periodInDays; i++) {
    names = this.getNamesForDate(date)
    switch (true) {
      case i === 0:
        formattedDate = 'Ma'
      break
      case i === 1:
        formattedDate = 'Holnap'
      break
      case i === 2:
        formattedDate = 'Holnapután'
      break
      default:
        formattedDate = date.format('MM.DD')
      break
    }
    lines.push(formattedDate + ': ' + names.join(', '))
    date.add(1, 'days')
  }

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
  });

  // setup email data with unicode symbols
  var mailOptions = {
    from: toEmail,
    to: toEmail,
    subject: 'Névnap (' + lines[0] + '; ' + lines[1] + ')',
    text: lines.join('\n\n')
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

module.exports = exports = Nameday