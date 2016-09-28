'use strict'

const ClientSocket = require('./index').Client
const client = new ClientSocket({ address: 'localhost', port: 43214 })
const rl = require('readline').createInterface(process.stdin, process.stdout);

client.on('message', (m) => {
  console.log(m)
})

rl.on('line', (line) => {
  client.emit('message', line.trim());
})