// export is empty, you can import by "trezor-link/parallel", "trezor-link/lowlevel", "trezor-link/bridge"

import BridgeTransportV2 from "./bridge/v2";
import BridgeTransportV2New from "./bridge/v2-new";
import LowlevelTransportWithSharedConnections from "./lowlevel/withSharedConnections";
import FallbackTransport from "./fallback";
import WebUsbPlugin from "./lowlevel/webusb";

export type {
  Transport,
  AcquireInput,
  TrezorDeviceInfoWithSession,
  MessageFromTrezor,
} from "./transport";

// node throw error with version 3.0.0
// https://github.com/github/fetch/issues/657
try {
  require(`whatwg-fetch`);
} catch (e) {
  // empty
}

if (typeof window === `undefined`) {
  // eslint-disable-next-line quotes
  const fetch = require("node-fetch");
  BridgeTransportV2.setFetch(fetch, true);
  BridgeTransportV2New.setFetch(fetch, true);
} else {
  BridgeTransportV2.setFetch(fetch, false);
  BridgeTransportV2New.setFetch(fetch, false);
}

export default {
  BridgeV2: BridgeTransportV2,
  BridgeV2New: BridgeTransportV2New,
  Fallback: FallbackTransport,
  Lowlevel: LowlevelTransportWithSharedConnections,
  WebUsb: WebUsbPlugin,
};
