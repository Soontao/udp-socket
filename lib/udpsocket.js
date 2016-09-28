'use strict'

const dgram = require('dgram');
const ClientBase = require('./udpclient').SocketBase;
const SocketEmitter = require('./udpclient').SocketEmitter;

class ServerSocket extends ClientBase {

  constructor(server, rinfo) {
    super();
    this.server = server;
    this.key = `${rinfo.address}-${rinfo.port}`
    this.rinfo = rinfo;
    this.socket = this.server.socket;
    this.isalive = true;
    this.emitter.on('server-message', (buf, rinfo) => {
      const payload = JSON.parse(buf.toString())
      const event = payload.event;
      const msg = payload.message;
      this.emitter.emit(event, msg, rinfo);
    });
    this.emitter.on('close', (buf, rinfo) => {
      clearInterval(this.heartcheck);
      delete this.server.clients[this.key]
    });
    this.emitter.on('heartbreak', () => {
      this.isalive = true
    });
    this.heartcheck = setInterval(() => {
      if (!this.isalive) this.emitter.emit('close', null, this.rinfo);
      else this.isalive = false;
    }, 15 * 1000);
  }
}




/**
 * 基于udp socket的封装
 */
class UdpServer extends SocketEmitter {

  constructor() {
    super();
    this.socket = dgram.createSocket('udp4');
    this.clients = {};
    this.socket.on('message', (buf, rinfo) => {
      const key = `${rinfo.address}-${rinfo.port}`
      let client = this.clients[key];
      if (!client) {
        client = (this.clients[key] = new ServerSocket(this, rinfo));
        this.emit('connecting', client, rinfo)
      }
      client.emitter.emit('server-message', buf, rinfo)
    });

    this.socket.on('listening', () => this.emit('listening', this.socket))
  }

  listen(port) {
    this.socket.bind(port);
  }

}


module.exports = UdpServer;