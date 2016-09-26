'use strict'

const dgram = require('dgram');
const EventEmitter = require('events');

class SocketEmitter extends EventEmitter {}
class ClientBase {

  on(event, cb) {
    this.emitter.on(event, cb);
  }

  emit(event, msg, cb) {
    const buf = new Buffer(JSON.stringify({ event: event, message: msg }));
    this.socket.send(buf, 0, buf.length, this.rinfo.port, this.rinfo.address);
    if (cb) cb();
  }

  close(cb) {
    this.emit('close', null, cb);
  }

}

class SocketClient extends ClientBase {

  constructor(rinfo) {
    super();
    this.emitter = new SocketEmitter();
    this.socket = dgram.createSocket('udp4');
    this.rinfo = rinfo

    this.socket.on('message', (buf, rinfo) => {
      const payload = JSON.parse(buf.toString())
      const event = payload.event;
      const msg = payload.message;
      this.emitter.emit(event, msg, rinfo);
    });
    this.heartbreak = setInterval(() => this.emit('hearbreak'), 7 * 1000)
  }
}

module.exports = {
  SocketClient: SocketClient,
  ClientBase: ClientBase
};