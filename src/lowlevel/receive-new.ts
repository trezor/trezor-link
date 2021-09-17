import * as ByteBuffer from "bytebuffer";

import { decode } from './protobuf/decoder';

export function receiveOne(messages: any, data: Buffer) {
  const byteBuffer: ByteBuffer = ByteBuffer.concat([data]);
  const typeId: number = byteBuffer.readUint16();

  const messageTypes =
    messages.nested.hw.nested.trezor.nested.messages.nested.MessageType.values;
  const messageType = Object.keys(messageTypes)
    .find((type) => messageTypes[type] === typeId)
    .replace("MessageType_", "");

  const accessor = `hw.trezor.messages.${messageType}`;
  const Message = messages.lookupType(accessor);

  byteBuffer.readUint32(); // length, ignoring

  const message = decode(Message, byteBuffer.toBuffer());

  return {
    message,
    type: messageType,
  };
}
