'use strict'
const UdpSocket = require('./index');

const server = new UdpSocket();

server.onConnecting(client => {
  client.on('hello', msg => {
    console.log(msg)
  })
})


server.onListening(() => {
  console.log(`listen on ${JSON.stringify(server.socket.address())}`)
})

server.socket.bind(43214);