import * as ByteBuffer from "bytebuffer";

import { messageToJSON } from "./protobuf/message_decoder-new";

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


  const m = Message.decode(byteBuffer.toBuffer());
  console.log('receive raw', m);
  // const message = Message.toObject(m, {
  //   enums: String,  // enums as string names
  //   longs: String,  // longs as strings (requires long.js)
  //   bytes: String,  // bytes as base64 encoded strings
  //   defaults: false, // includes default values
  //   arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
  //   objects: true,  // populates empty objects (map fields) even if defaults=false
  //   oneofs: true    // incl
  // });

  const asObj = Message.toObject(m, {
    defaults: false,

  });

  const after = messageToJSON(m, asObj);
  console.log('receive after ', after);
  return {
    message: after,
    type: messageType,
  };
}
