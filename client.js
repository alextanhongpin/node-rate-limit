const request = require('request')

// function delay (duration) {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(duration), duration)
//   })
// }

// function callAPI (i) {
//   return new Promise((resolve, reject) => {
//     const options = {
//       uri: 'http://localhost:4000/',
//       method: 'POST',
//       body: {
//         name: i % 2 === 0 ? 'john' : 'jane'
//       },
//       json: true
//     }
//     request(options, function (error, response, body) {
//       // console.log(response && response.statusCode)
//       // console.log(response && response.headers, body, error)
//       error ? reject(error) : resolve([body, response && response.statusCode])
//     })
//   })
// }
// async function call (iteration = 0, threshold = 0) {
//   const arr = Array(100).fill(0)
//   const promises = arr.map((_, i) => {
//     return callAPI(i)
//   })

//   try {
//     const data = await Promise.all(promises)
//     const isRateLimited = data.map(([body, statusCode]) => statusCode).some(code => code === 429)
//     const numErrors = data.map(([body, statusCode]) => statusCode).filter(code => code > 400 && code !== 429).length
//     if (numErrors) {
//       console.log('numErrors', numErrors)
//       threshold += numErrors
//       if (threshold > 10) {
//         throw new Error(`Too many errors = ${threshold}. Exiting program.`)
//       }
//     }

//     if (!isRateLimited) {
//       iteration += 1
//       console.log('done', iteration)
//       if (iteration < 10) {
//         call(iteration, threshold)
//       } else {
//         console.timeEnd()
//       }
//     } else {
//       console.log('Rate limited, waiting 1 second')
//       await delay(1000)
//       call(iteration)
//     }
//   } catch (error) {
//     threshold += 1
//     if (threshold > 10) {
//       throw new Error(`Too many errors ${threshold}. Exiting program.`)
//     }
//     await delay(1000)
//     call(iteration, threshold)
//   }
// }

// console.time()
// call().catch(console.error)

function callAPI () {
  return new Promise((resolve, reject) => {
    request('http://localhost:3000/no-limit', {
      forever: true
    }, (error, response, body) => {
      error ? reject(error) : resolve(body)
    })
  })
}

function loop (count = 0) {
  count++

  return callAPI().then(() => {
    if (count < 10000) {
      return loop(count)
    } else {
      return count
    }
  })
}

console.time('benchmark')
loop().then(() => {
  console.timeEnd('benchmark')
})
