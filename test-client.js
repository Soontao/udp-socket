'use strict'

const ClientSocket = require('./index').Client
const client = new ClientSocket({ address: 'localhost', port: 43214 })
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

client.on('message', (m) => {
  console.log(m)
})

client.socket.on('listening', () => {
  console.log(client.socket.address().port)
})

rl.on('line', (line) => {
  client.emit('message', line.trim());
})