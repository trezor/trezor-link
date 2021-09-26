import * as ByteBuffer from "bytebuffer";
import { Root } from "protobufjs";

import * as decodeProtobuf from "./protobuf/decode";
import * as decodeProtocol from "./protocol/decode";
import { createMessageFromType } from "./protobuf/messages";

export function receiveOne(messages: Root, data: Buffer) {
  const { typeId, buffer } = decodeProtocol.decode(data);
  const { Message, messageType } = createMessageFromType(messages, typeId);
  const message = decodeProtobuf.decode(Message, buffer);

  return {
    message,
    type: messageType,
  };
}

async function receiveRest(
  parsedInput: any,
  receiver: () => Promise<ArrayBuffer>,
  expectedLength
) {
  if (parsedInput.offset >= expectedLength) {
    return;
  }
  const data = await receiver();
  // sanity check
  if (data == null) {
    throw new Error(`Received no data.`);
  }

  parsedInput.append(data);

  return receiveRest(parsedInput, receiver, expectedLength);
}

async function receiveBuffer(receiver: () => Promise<ArrayBuffer>) {
  const data = await receiver();
  const { length, typeId, restBuffer } = decodeProtocol.decodeChunked(data);
  const decoded = new ByteBuffer(length);
  decoded.append(restBuffer);

  await receiveRest(decoded, receiver, length);
  return { received: decoded, typeId };
}

export async function receiveAndParse(
  messages: Root,
  receiver: () => Promise<ArrayBuffer>
) {
  const { received, typeId } = await receiveBuffer(receiver);

  const { Message, messageType } = createMessageFromType(messages, typeId);
  const message = decodeProtobuf.decode(Message, received.buffer);
  return {
    message,
    type: messageType,
  };
}
