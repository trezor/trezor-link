import * as ByteBuffer from "bytebuffer";

import { messageToJSON } from "./protobuf/message_decoder-new";

export function receiveOne(
  messages: any,
  data: Buffer
) {
  const byteBuffer: ByteBuffer = ByteBuffer.concat([data]);
  const typeId: number = byteBuffer.readUint16();

  const messageTypes = messages.nested.hw.nested.trezor.nested.messages.nested.MessageType.values;
  const messageType = Object.keys(messageTypes).find(type => {
    return messageTypes[type] === typeId;
  }).replace('MessageType_', '');

  const accessor = `hw.trezor.messages.${messageType}`;
  const Message = messages.lookupType(accessor);

  byteBuffer.readUint32(); // length, ignoring

  return {
    message: messageToJSON(Message.decode(byteBuffer.toBuffer())),
    type: messageType,
  }
}
