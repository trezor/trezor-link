// Module for loading the protobuf description from serialized description

import * as protobuf from "protobufjs";

// Parse configure data (it has to be already verified)
export function parseConfigure(data: protobuf.INamespace) {
  return protobuf.Root.fromJSON(data);
}
