// Logic of sending data to trezor
//
// Logic of "call" is broken to two parts - sending and receiving
import { Root } from "protobufjs";
import { encode as encodeProtobuf } from "./protobuf";
import { encode as encodeProtocol } from "./protocol";
import { createMessageFromName } from '../lowlevel/protobuf/parse_protocol-new';

// Sends message to device.
// Resolves if everything gets sent
export function buildOne(messages: Root, name: string, data: Object) {
  const { Message, messageType } = createMessageFromName(messages, name);

  const buffer = encodeProtobuf(Message, data);
  return encodeProtocol(buffer, {
    addTrezorHeaders: false,
    trezorFormat: false,
    messageType,
  });
}

export const buildBuffers = (messages: Root, name: string, data: Object) => {
  const { Message, messageType } = createMessageFromName(messages, name);
  const buffer = encodeProtobuf(Message, data);
  return encodeProtocol(buffer, {
    addTrezorHeaders: true,
    trezorFormat: true,
    messageType,
  });
};
