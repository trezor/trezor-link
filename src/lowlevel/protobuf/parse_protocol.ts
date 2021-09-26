// Module for loading the protobuf description from serialized description

import * as protobuf from "protobufjs";

// Parse configure data (it has to be already verified)
export function parseConfigure(data: protobuf.INamespace) {
  // @ts-ignore todo: remove this after update in connect
  if (typeof data === "string") {
    return protobuf.Root.fromJSON(JSON.parse(data));
  }
  return protobuf.Root.fromJSON(data);
}

export const createMessageFromName = (
  messages: protobuf.Root,
  name: string
) => {
  const accessor = `hw.trezor.messages.${name}`;
  const Message = messages.lookupType(accessor);
  const MessageType = messages.lookupEnum(`MessageType`);
  const messageType = MessageType.values[`MessageType_${name}`];

  // todo: this hack is probably not needed anymore
  // todo: maybe it is needed but not covered by tests here. try connect

  // if (!messageType && Message.options) {
  //   messageType = Message.options["(wire_type)"];
  // }

  return {
    Message,
    messageType,
  };
};

export const createMessageFromType = (
  messages: protobuf.Root,
  typeId: number
) => {
  const MessageType = messages.lookupEnum(`MessageType`);
  // todo: make this will work. remember fuckup with MessageType_Something_Deprecated?
  const messageName = MessageType.valuesById[typeId].replace(
    "MessageType_",
    ""
  );

  const accessor = `hw.trezor.messages.${messageName}`;
  const Message = messages.lookupType(accessor);

  return {
    Message,
    // todo:
    messageType: messageName,
  };
};
