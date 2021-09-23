/* @flow */

// Logic of sending data to trezor
//
// Logic of "call" is broken to two parts - sending and receiving
import * as ByteBuffer from 'bytebuffer';
import { encode as encodeProtobuf } from "./protobuf";
import { encode as encodeProtocol } from "./protocol";

const createMessage = (messages, name) => {
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
  return {
    Message,
    messageType,
  };
};

// Sends message to device.
// Resolves if everything gets sent
export function buildOne(messages: any, name: string, data: Object) {
  const { Message, messageType } = createMessage(messages, name);

  const buffer = encodeProtobuf(Message, data);
  return encodeProtocol(buffer, {
    addTrezorHeaders: false,
    trezorFormat: false,
    messageType,
  });
}

export const buildBuffers = (messages: any, name: string, data: Object) => {
  const { Message, messageType } = createMessage(messages, name);
  const buffer = encodeProtobuf(Message, data);
  return encodeProtocol(buffer, {
    addTrezorHeaders: true,
    trezorFormat: true,
    messageType,
  });
};
