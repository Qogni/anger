'use strict'

const Hapi = require('hapi')
const Nes = require('nes')

async function build () {
  const server = new Hapi.Server({
    host: 'localhost',
    port: 0
  })

  server.count = 0

  await server.register({ plugin: Nes })

  server.subscription('/greet')

  server.route({
    method: 'POST',
    path: '/h',
    config: {
      id: 'hello',
      handler: (request, h) => {
        server.count++
        server.publish('/greet', { hello: 'world', meta: { id: request.payload.id } })
        return 'world!'
      }
    }
  })

  await server.start()
  return server
}

module.exports = build

if (require.main === module) {
  build().then(server => {
    console.log(`server listening at ${server.info.uri}`)
  })
}
