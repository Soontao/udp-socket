'use strict'

const dgram = require('dgram');
const EventEmitter = require('events');

class UdpEmitter extends EventEmitter {}

class SocketEmitter extends EventEmitter {}

class ClientSocket {

  constructor(server, rinfo) {
    this.server = server;
    this.raddress = rinfo.address;
    this.rport = rinfo.port;
    this.emitter = new SocketEmitter();
    this.emitter.on('message', (buf) => {
      const payload = JSON.parse(buf.toString())
      const event = payload.event;
      const msg = payload.message;
      this.emitter.emit(event, {
        message: msg,
        rinfo: rinfo
      });
    })
    this.on = this.emitter.on;
  }


  /**
   * 调用远程事件
   */
  emit(event, msg) {
    const buf = new Buffer(JSON.stringify({ event: event, message: msg }));
    this.server.send(buf, 0, buf.length, this.rport, this.raddress);
  }

}

/**
 * 基于udp socket的封装
 */
class UdpSocketServer {

  constructor() {
    this.socket = dgram.createSocket('udp4');
    this.emitter = new UdpEmitter();
    this.clients = {};
    this.socket.on('message', (buf, rinfo) => {
      let client = this.clients[rinfo];
      if (!client) {
        client = (this.clients[rinfo] = new ClientSocket(this, rinfo));
        this.emitter.emit('connecting', client)
      }
      client.emitter.emit('message', buf)
    });
    this.on = this.emitter.on;
  }


  onConnecting(cb) {
    this.emitter.on('connecting', cb)
  }



  listen(port) {
    this.socket.bind(port);
  }

  /**
   * 监听远程事件
   */
  on(event, cb) {
    this.emitter.on(event, cb);
  }

  /**
   * 调用远程事件
   */
  emit(event, msg) {
    const buf = new Buffer(JSON.stringify({ event: event, message: msg }));
    this.socket.send(buf);
  }

  /**
   * socket监听回调
   */
  onListening(cb) {
    this.socket.on('listening', cb);
  }

}


module.exports = UdpSocketServer;