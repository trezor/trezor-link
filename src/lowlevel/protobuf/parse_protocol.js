/* @flow */

"use strict";

// Module for loading the protobuf description from serialized description

import * as ProtoBuf from "protobufjs-old-fixed-webpack";

import {Messages} from "./messages.js";
const messagesJson = require(`./messages.json`);

// Parse configure data (it has to be already verified)
export function parseConfigure(data: Buffer): Messages {
  const protobufMessages = ProtoBuf.newBuilder({})[`import`](messagesJson).build();

  return new Messages(protobufMessages);
}

