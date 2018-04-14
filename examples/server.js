'use strict'

const Hapi = require('hapi')
const Nes = require('nes')

const server = new Hapi.Server({
  host: 'localhost',
  port: 3000
})

;(async () => {
  await server.register({ plugin: Nes })
  server.subscription('/greet')

  server.route({
    method: 'POST',
    path: '/h',
    config: {
      id: 'hello',
      handler: (request, h) => {
        // in the publish response we assign meta.id to the request payload id
        server.publish('/greet', { hello: 'world', meta: { id: request.payload.id } })
        return 'world!'
      }
    }
  })

  await server.start()
  console.log('now listening on localhost:3000')
})()
