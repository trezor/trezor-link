/* @flow */

"use strict";

// Module for loading the protobuf description from serialized description

import * as ProtoBuf from "protobufjs-old-fixed-webpack";

import {Messages} from "./messages.js";

// Parse configure data (it has to be already verified)
export function createMessages(protobufJson: Object): Messages {
  const protobufMessages = ProtoBuf.newBuilder({})[`import`](protobufJson).build();

  return new Messages(protobufMessages);
}

