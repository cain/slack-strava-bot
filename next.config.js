module.exports = {
  env: {
    WEB_URL: process.env.APP_ENV === 'production' ? 'https://slack-strava-bot.vercel.app/' : 'http://localhost:3000',
  },
}
