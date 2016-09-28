'use strict'

const dgram = require('dgram');
const EventEmitter = require('events');

class SocketEmitter extends EventEmitter {}
class ScoketBase {

  constructor() {
    this.emitter = new SocketEmitter();
  }

  on(event, cb) {
    this.emitter.on(event, cb);
  }

  emit(event, msg) {
    const buf = new Buffer(JSON.stringify({ event: event, message: msg }));
    this.socket.send(buf, 0, buf.length, this.rinfo.port, this.rinfo.address);
  }

  close() {
    this.emit('close', null);
  }

}

class SocketClient extends ScoketBase {

  constructor(rinfo) {
    super();
    this.socket = dgram.createSocket('udp4');
    this.rinfo = rinfo

    this.socket.on('message', (buf, rinfo) => {
      const payload = JSON.parse(buf.toString())
      const event = payload.event;
      const msg = payload.message;
      this.emitter.emit(event, msg, rinfo);
    });
    this.heartbreak = setInterval(() => this.emit('heartbreak'), 7 * 1000)
  }
}

module.exports = {
  SocketClient: SocketClient,
  SocketBase: ScoketBase,
  SocketEmitter: SocketEmitter
};