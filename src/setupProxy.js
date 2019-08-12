const PrismaProxy = require('@prisma-cms/front/lib/setupProxy')
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy('/ws.js/socket.io/', {
      pathRewrite: { '^/ws.js': '' },
      target: 'http://localhost:5000',
      ws: true
    })
  )

  PrismaProxy(app)
}
