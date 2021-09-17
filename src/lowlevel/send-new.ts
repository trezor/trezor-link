/* @flow */

// Logic of sending data to trezor
//
// Logic of "call" is broken to two parts - sending and receiving

import * as ByteBuffer from "bytebuffer";
import type { Messages } from "./protobuf/messages";

import { encode } from "./protobuf/encoder";

const HEADER_SIZE = 1 + 1 + 4 + 2;

// Sends message to device.
// Resolves if everything gets sent
export function buildOne(
  messages: Messages,
  name: string,
  data: Object
): Buffer {
 
  const accessor = `hw.trezor.messages.${name}`;
  // @ts-ignore
  const Message = messages.lookupType(accessor);

  let messageType =
    // @ts-ignore
    messages.nested.hw.nested.trezor.nested.messages.nested.MessageType.values[
    `MessageType_${name}`
    ];

  if (!messageType && Message.options) {
    messageType = Message.options["(wire_type)"];
  }

  const buffer = encode(Message, data);

  const headerSize: number = HEADER_SIZE; // should be 8
  // @ts-ignore
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
