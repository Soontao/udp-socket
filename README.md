# udp socket

A module like socket.io but implement with udp protocol

In statard,websocket shoule be implement with tcp/http,this module just a exercise,so please not use it in production environment

## usage - a simple chat server

server

```js
'use strict'

const UdpSocket = require('udpsocket').Server
const server = new UdpSocket();
const rl =  require('readline').readline.createInterface(process.stdin, process.stdout);

let cclient = null;
server.on('connecting', client => {
  cclient = client;
  console.log(`connect from ${client.rinfo.address}:${client.rinfo.port}`)
  client.on('message', msg => {
    console.log(msg)
  })
})

rl.on('line', (line) => {
  cclient.emit('message', line.trim());
})

server.socket.bind(43214);
```

client

```js
'use strict'

const ClientSocket = require('udpsocket').Client
const client = new ClientSocket({ address: 'localhost', port: 43214 })
const rl = require('readline').createInterface(process.stdin, process.stdout);

client.on('message', (m) => {
  console.log(m)
})

rl.on('line', (line) => {
  client.emit('message', line.trim());
})
```

## TO DO

ack

check server is alive

faster serialize
