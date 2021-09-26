import "whatwg-fetch"; // polyfills window.fetch

import BridgeTransportV2 from "./bridge/v2";
import LowlevelTransportWithSharedConnections from "./lowlevel/withSharedConnections";
import FallbackTransport from "./fallback";
import WebUsbPlugin from "./lowlevel/webusb";

if (typeof window === `undefined`) {
  import("node-fetch").then((fetch) => {
    BridgeTransportV2.setFetch(fetch, true);
  });
} else {
  BridgeTransportV2.setFetch(fetch, false);
}

export type {
  Transport,
  AcquireInput,
  TrezorDeviceInfoWithSession,
  MessageFromTrezor,
} from "./types";

export default {
  BridgeV2: BridgeTransportV2,
  Fallback: FallbackTransport,
  Lowlevel: LowlevelTransportWithSharedConnections,
  WebUsb: WebUsbPlugin,
};
