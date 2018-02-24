const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork()
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  const RateLimiter = require('limiter').RateLimiter
  const express = require('express')
  const app = express()

  const limiter = new RateLimiter(60, 'second')

  app.get('/', (req, res) => {
    limiter.removeTokens(1, (err, remaining) => {
      if (err || remaining < 1) {
        console.log('Too many requests')
        res.writeHead(429, {'Content-Type': 'text/plain;charset=UTF-8'})
        res.end('429 Too Many Requests - your IP is being rate limited')
      } else {
        res.status(200).json({
          msg: 'hello world'
        })
      }
    })
  })

  app.listen(3000, () => {
    console.log(`listening to port *:3000. press ctrl + c to cancel.`)
  })
}