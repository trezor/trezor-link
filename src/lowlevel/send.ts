// Logic of sending data to trezor
//
// Logic of "call" is broken to two parts - sending and receiving
import { Root } from "protobufjs";
import { encode as encodeProtobuf } from "./protobuf";
import { encode as encodeProtocol } from "./protocol";
import { createMessageFromName } from "./protobuf/parse_protocol";

// Sends more buffers to device.
async function sendBuffers(
  sender: (data: ArrayBuffer) => Promise<void>,
  buffers: Array<ArrayBuffer>
): Promise<void> {
  // eslint-disable-next-line prefer-const
  for (let buffer of buffers) {
    await sender(buffer);
  }
}

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

// Sends message to device.
// Resolves if everything gets sent
export async function buildAndSend(
  messages: Root,
  sender: (data: ArrayBuffer) => Promise<void>,
  name: string,
  data: Object
): Promise<void> {
  const buffers = buildBuffers(messages, name, data);
  // @ts-ignore
  return sendBuffers(sender, buffers);
}
