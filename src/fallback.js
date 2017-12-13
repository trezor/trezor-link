/* @flow */

import type {Transport, AcquireInput, TrezorDeviceInfoWithSession, MessageFromTrezor} from './transport';

import {debugInOut} from './debug-decorator';

export default class FallbackTransport {
  name: string = `FallbackTransport`;
  activeName: string = ``;

  _availableTransports: Array<Transport>;
  transports: Array<Transport>;
  version: string;
  debug: boolean = false;

  // note: activeTransport is actually "?Transport", but
  // everywhere I am using it is in `async`, so error gets returned as Promise.reject
  activeTransport: Transport;

  constructor(transports: Array<Transport>) {
    this.transports = transports;
  }

  // first one that inits successfuly is the final one; others won't even start initing
  async _tryTransports(): Promise<Transport> {
    let lastError: ?Error = null;
    for (const transport of this.transports) {
      try {
        await transport.init(this.debug);
        return transport;
      } catch (e) {
        lastError = e;
      }
    }
    throw lastError || new Error(`No transport could be initialized.`);
  }

  @debugInOut
  async init(debug: ?boolean): Promise<void> {
    this.debug = !!debug;

    const transport = await this._tryTransports();
    this.activeTransport = transport;
    this.version = this.activeTransport.version;
    this.activeName = this.activeTransport.name;
    this.requestNeeded = this.activeTransport.requestNeeded;
  }

  setMessages(messagesJson: Object): void {
    this.activeTransport.setMessages(messagesJson);
  }

  async enumerate(): Promise<Array<TrezorDeviceInfoWithSession>> {
    return this.activeTransport.enumerate();
  }

  async listen(old: ?Array<TrezorDeviceInfoWithSession>): Promise<Array<TrezorDeviceInfoWithSession>> {
    return this.activeTransport.listen(old);
  }

  async acquire(input: AcquireInput): Promise<string> {
    return this.activeTransport.acquire(input);
  }

  async release(session: string): Promise<void> {
    return this.activeTransport.release(session);
  }

  async call(session: string, name: string, data: Object): Promise<MessageFromTrezor> {
    return this.activeTransport.call(session, name, data);
  }

  async requestDevice(): Promise<void> {
    return this.activeTransport.requestDevice();
  }

  requestNeeded: boolean = false;
}
