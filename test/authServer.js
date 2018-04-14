const Hapi = require('hapi')
const Basic = require('hapi-auth-basic')
const Nes = require('nes')

async function build () {
  const server = new Hapi.Server({
    host: 'localhost',
    port: 0
  })

  server.count = 0
  server.failedCount = 0

  await server.register({ plugin: Basic })
  await server.register({ plugin: Nes })

  server.users = {
    john: {
      username: 'john',
      name: 'John Doe',
      id: '2133d32a',
      signin: 0
    },
    james: {
      username: 'james',
      name: 'James Doe',
      id: '2143d3ff',
      signin: 0
    }
  }

  const validate = async (request, username, password, h) => {
    const user = server.users[username]
    if (!user) {
      server.failedCount++
      return { credentials: null, isValid: false }
    }
    server.users[username].signin++

    return {
      isValid: password === server.users[username].username,
      credentials: { id: user.id, name: user.name }
    }
  }

  server.auth.strategy('simple', 'basic', { validate })
  server.auth.default('simple', { validate })

  server.subscription('/greet')

  server.route({
    method: 'POST',
    path: '/h',
    config: {
      id: 'hello',
      handler: function (request, h) {
        server.count++
        server.publish('/greet', { hello: 'world', meta: { id: request.payload.id } })
        return 'Hello ' + request.auth.credentials.name
      }
    }
  })

  await server.start()
  return server
}

module.exports = build
