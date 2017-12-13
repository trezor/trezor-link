/* @flow */

// export is empty, you can import by "trezor-link/parallel", "trezor-link/lowlevel", "trezor-link/bridge"

export type {Transport, AcquireInput, TrezorDeviceInfoWithSession, MessageFromTrezor} from './transport';

import BridgeTransport from './bridge';
import LowlevelTransportWithSharedConnections from './lowlevel/withSharedConnections';
import FallbackTransport from './fallback';
import WebUsbPlugin from './lowlevel/webusb';

import 'whatwg-fetch';

BridgeTransport.setFetch(fetch);

export default {
  Bridge: BridgeTransport,
  Fallback: FallbackTransport,
  Lowlevel: LowlevelTransportWithSharedConnections,
  WebUsb: WebUsbPlugin,
};
