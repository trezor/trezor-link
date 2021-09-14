/* @flow */

// Logic of sending data to trezor
//
// Logic of "call" is broken to two parts - sending and receiving

import * as ByteBuffer from "bytebuffer";
import type { Messages } from "./protobuf/messages";

const patchNew = require("./protobuf/monkey_patch-new").patch;

const HEADER_SIZE = 1 + 1 + 4 + 2;

// Sends message to device.
// Resolves if everything gets sent
export function buildOne(
  messages: Messages,
  name: string,
  data: Object
): Buffer {
  const accessor = `hw.trezor.messages.${name}`;
  const messageType =
    // @ts-ignore
    messages.nested.hw.nested.trezor.nested.messages.nested.MessageType.values[
    `MessageType_${name}`
    ];
  // @ts-ignore
  const Message = messages.lookupType(accessor);

  const payload = patchNew(Message, data);
  // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  const errMsg = Message.verify(payload);
  if (errMsg) {
    console.log(errMsg);
    // throw Error(errMsg);
  }

  // Create a new message
  const message = Message.fromObject(payload, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true, // includes virtual oneof fields set to the present field's name
  });

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  const buffer = Message.encode(message).finish();

  const headerSize: number = HEADER_SIZE; // should be 8
  const bytes: Uint8Array = new Uint8Array(buffer);
  const fullSize: number = headerSize - 2 + bytes.length;

  const encodedByteBuffer = new ByteBuffer(fullSize);

  // 2 bytes
  encodedByteBuffer.writeUint16(messageType);

  // 4 bytes (so 8 in total)
  encodedByteBuffer.writeUint32(bytes.length);

  // then put in the actual message
  encodedByteBuffer.append(bytes);

  // and convert to uint8 array
  // (it can still be too long to send though)
  const encoded: Uint8Array = new Uint8Array(encodedByteBuffer.buffer);

  // return bytes;
  return Buffer.from(encoded);
}
