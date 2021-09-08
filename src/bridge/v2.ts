// bridge v2 is half-way between lowlevel and not
// however, it is not doing actual sending in/to the devices
// and it refers enumerate to bridge

'use strict';

import semvercmp from 'semver-compare';
import { request as http, setFetch as rSetFetch } from './http';
import type { AcquireInput, TrezorDeviceInfoWithSession } from '../transport';
import * as check from '../highlevel-checks';

import { buildOne } from '../lowlevel/send';
import type { Messages } from '../lowlevel/protobuf/messages';
import { parseConfigure } from '../lowlevel/protobuf/parse_protocol';
import { receiveOne } from '../lowlevel/receive';

const DEFAULT_URL = `http://127.0.0.1:21325`;
const DEFAULT_VERSION_URL = `https://wallet.trezor.io/data/bridge/latest.txt`;

type IncompleteRequestOptions = {
  body?: Array<any> | Object | string;
  url: string;
};

export default class BridgeTransport {
  name: string = `BridgeTransport`;
  version: string = ``;
  isOutdated: boolean;

  url: string;
  newestVersionUrl: string;
  bridgeVersion: string;
  debug: boolean = false;

  configured: boolean = false;
  _messages: Messages | undefined;

  stopped: boolean = false;

  constructor(url?: string, newestVersionUrl?: string) {
    this.url = url == null ? DEFAULT_URL : url;
    this.newestVersionUrl = newestVersionUrl == null ? DEFAULT_VERSION_URL : newestVersionUrl;
  }

  async _post(options: IncompleteRequestOptions) {
    if (this.stopped) {
      return Promise.reject(`Transport stopped.`);
    }
    return await http({ ...options, method: `POST`, url: this.url + options.url, skipContentTypeHeader: true });
  }

  async init(debug: boolean): Promise<void> {
    this.debug = !!debug;
    await this._silentInit();
  }

  async _silentInit(): Promise<void> {
    const infoS = await http({
      url: this.url,
      method: `POST`,
    });
    const info = check.info(infoS);
    this.version = info.version;
    const newVersion = typeof this.bridgeVersion === `string` ? this.bridgeVersion : check.version(await http({
      url: `${this.newestVersionUrl}?${Date.now()}`,
      method: `GET`,
    }));
    this.isOutdated = semvercmp(this.version, newVersion) < 0;
  }

  async configure(signedData: JSON | string): Promise<void> {
    const messages = parseConfigure(signedData);
    this.configured = true;
    this._messages = messages;
  }

  async listen(old?: Array<TrezorDeviceInfoWithSession>): Promise<Array<TrezorDeviceInfoWithSession>> {
    if (old == null) {
      throw new Error(`Bridge v2 does not support listen without previous.`);
    }
    const devicesS = await this._post({
      url: `/listen`,
      body: old,
    });
    const devices = check.devices(devicesS);
    return devices;
  }

  async enumerate(): Promise<Array<TrezorDeviceInfoWithSession>> {
    const devicesS = await this._post({ url: `/enumerate` });
    const devices = check.devices(devicesS);
    return devices;
  }

  async _acquireMixed(input: AcquireInput, debugLink: boolean) {
    const previousStr = input.previous == null ? `null` : input.previous;
    const url = (debugLink ? `/debug` : ``) + `/acquire/` + input.path + `/` + previousStr;
    return this._post({ url: url });
  }

  async acquire(input: AcquireInput, debugLink: boolean) {
    const acquireS = await this._acquireMixed(input, debugLink);
    return check.acquire(acquireS);
  }

  async release(session: string, onclose: boolean, debugLink: boolean) {
    const res = this._post({ url: (debugLink ? `/debug` : ``) + `/release/` + session });
    if (onclose) {
      return;
    }
    await res;
  }

  async call(session: string, name: string, data: Object, debugLink: boolean) {
    if (this._messages == null) {
      throw new Error(`Transport not configured.`);
    }
    const messages = this._messages;
    const outData = buildOne(messages, name, data).toString(`hex`);
    const resData = await this._post({
      url: (debugLink ? `/debug` : ``) + `/call/` + session,
      body: outData,
    });
    if (typeof resData !== `string`) {
      throw new Error(`Returning data is not string.`);
    }
    const jsonData = receiveOne(messages, new Buffer(resData, `hex`));
    return check.call(jsonData);
  }

  async post(session: string, name: string, data: Object, debugLink: boolean) {
    if (this._messages == null) {
      throw new Error(`Transport not configured.`);
    }
    const messages = this._messages;
    const outData = buildOne(messages, name, data).toString(`hex`);
    await this._post({
      url: (debugLink ? `/debug` : ``) + `/post/` + session,
      body: outData,
    });
    return;
  }

  async read(session: string, debugLink: boolean) {
    if (this._messages == null) {
      throw new Error(`Transport not configured.`);
    }
    const messages = this._messages;
    const resData = await this._post({
      url: (debugLink ? `/debug` : ``) + `/read/` + session,
    });
    if (typeof resData !== `string`) {
      throw new Error(`Returning data is not string.`);
    }
    const jsonData = receiveOne(messages, new Buffer(resData, `hex`));
    return check.call(jsonData);
  }

  static setFetch(fetch: any, isNode?: boolean) {
    rSetFetch(fetch, isNode);
  }

  requestDevice(): Promise<void> {
    return Promise.reject();
  }

  requestNeeded: boolean = false;

  setBridgeLatestUrl(url: string): void {
    this.newestVersionUrl = url;
  }

  setBridgeLatestVersion(version: string): void {
    this.bridgeVersion = version;
  }

  stop(): void {
    this.stopped = true;
  }
}
