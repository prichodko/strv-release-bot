const RssFeedEmitter = require('rss-feed-emitter')
const r = require('r2')

const repos = require('./repos')

const START = Date.now()
const WEB_HOOK = ''

function watch(repo) {
  const feeder = new RssFeedEmitter()

  feeder.add({
    url: `${repo.url}/releases.atom`,
    refresh: 43200000
  })

  feeder.on('new-item', item => {
    if (new Date(item.date) < START) {
      return
    }

    const title = `New release of ${repo.name} is out - ${item.title}`
    const link = item.link.includes('github')
      ? item.link
      : `https://github.com/${item.link}`

    r.post(WEB_HOOK, {
      json: {
        icon_emoji: repo.emoji,
        attachments: [
          {
            fallback: `${title} - ${link}`,
            title: title,
            title_link: link,
            text: "Read release notes and don't forget to update!",
            color: repo.color
          }
        ]
      }
    })
  })
}

// let the fun begin
repos.forEach(watch)
