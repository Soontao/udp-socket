module.exports = {
  Server: require('./lib/udpsocket'),
  Client: require('./lib/udpclient').SocketClient
}