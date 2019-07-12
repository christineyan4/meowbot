function parseForImages(html) {
  var parser = new DOMParser()
  var dom = parser.parseFromString(html, 'text/html')
  meows = dom.getElementsByTagName('img')

  // remove non-cat pics from meows
  for (var i = 0; i < meows.length; i++) {
    var imgSrc = meows[i].getAttribute('src')
    var split = imgSrc.split('/')
    if (split[1] !== 'thumbs') {
      meows.splice(i, 1)
      i -= 1
    }
  }
  return meows
}

function randomizeCat(meows) {
  var randomCat = meows[Math.floor(Math.random() * meows.length)].getAttribute('src')
  return randomCat
}

function getImgURL(randomCat) {
  // splice out thumbs, replace with pictures
  var tmp = randomCat.replace('thumbs', 'pictures')
  // remove _s left over from src tag
  var imgURL = tmp.replace('_s', '')
  imgURL = 'https://funnycatsite.com' + imgURL
  return imgURL
}

function botReply(imgURL) {
  // starting express app
  const app = express()
  // starting server
  app.listen(process.env.PORT, function() {
    console.log('Bot is listening on port ' + process.env.PORT)
  })

  // setting up parser for / cmds
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  // sending random cat pic in response to / cmd
  app.post('/', (req, res) => {
    var randomCat = randomizeCat(meows)
    var imgURL = getImgURL(randomCat)
    var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: '#meowbot',
      text: randomizeMessage(),
      attachments: JSON.stringify([
        {
          'text': 'have a great day!',
          'image_url': imgURL
        }
      ])
    }}
    request.post('https://slack.com/api/chat.postMessage', data,
      function(error, response, body) {
        // error handling
        console.error('error', error)
        console.log('statusCode:', response && response.statusCode)
        console.log('body:', body)
      })
  })
}

function randomizeMessage() {
  var messages = [
    'MRROOWWWW',
    'meeeeeoowwww',
    'PURRRRR',
    'miaoooo',
    'meoooo',
    'miaouuuu',
    'MYAUUUUU'
  ]

  var emojis = [
    ':smiley_cat:',
    ':heart_eyes_cat:',
    ':cat2:',
    ':pouting_cat:',
    ':cat:',
    ':joy_cat:'
  ]

  var rand1 = Math.floor(Math.random() * messages.length)
  var rand2 = Math.floor(Math.random() * emojis. length)
  return messages[rand1] + emojis[rand2]
}

// node dependencies
require('dotenv').config()

const fetch = require('node-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const DOMParser = require('dom-parser')

fetch('https://funnycatsite.com').then(res => {
  return res.text()
}).then(html => {
  return parseForImages(html)
}).then(meows => {
  return botReply(meows)
}).catch(error => {
  console.error('error:', error)
})

