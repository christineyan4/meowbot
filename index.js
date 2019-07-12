// node dependencies
require('dotenv').config()

const fetch = require('node-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const DOMParser = require('dom-parser')

var meows

// scraping for cat pics
fetch('https://funnycatsite.com').then(function(res) {
    return res.text();

  }).then(function(html) {
    // parsing HTML for images
    var parser = new DOMParser()
    var dom = parser.parseFromString(html, 'text/html')
    meows = dom.getElementsByTagName('img')
    return meows

  }).then(function(meows) {
    // choosing random cat pic
    var randCat = meows[Math.floor(Math.random() * meows.length)].getAttribute('src')
    console.log(randCat)
    return randCat

  }).then(function(randCat) {
    // starting express app
    const app = express()
    // starting server
    app.listen(process.env.PORT, function() {
      console.log('Bot is listening on port ' + process.env.PORT)
    })

    // setting up parser for slash commands
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())

    // sending random cat picture in response to / cmd
    app.post('/', (req, res) => {
      var data = {form: {
        token: process.env.SLACK_AUTH_TOKEN,
        channel: "#meowbot",
        text: "MROOWWWW :smiley_cat:",
        attachments: JSON.stringify([
          {
            "text": "hello",
            "image_url": "http://funnycatsite.com/pictures/diving_for_it.jpg"
          }
        ])
      }}
      request.post('https://slack.com/api/chat.postMessage', data,
        function (error, response, body) {
          // prints error message
          console.error('error:', error)
          console.log('statusCode:', response && response.statusCode)
          console.log('body:', body)
      })
    })
  }).catch(function(error) {
    console.error('error:', error)
})

