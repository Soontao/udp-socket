'use strict'
const UdpSocket = require('./index').Server
const server = new UdpSocket();

const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

let cclient = null;
server.on('connecting', client => {
  cclient = client;
  console.log(`connect from ${client.rinfo.address}:${client.rinfo.port}`)
  client.on('message', msg => {
    console.log(msg)
  })
})


server.onListening(() => {
  console.log(`listen on ${JSON.stringify(server.socket.address())}`)
})

rl.on('line', (line) => {
  cclient.emit('message', line.trim());
})

server.socket.bind(43214);