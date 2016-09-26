'use strict'

const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const payload = new Buffer(JSON.stringify({ event: "hello", message: "world" }))

client.send(payload, 0, payload.length, 43214, 'localhost')

client.send(payload, 0, payload.length, 43214, 'localhost')