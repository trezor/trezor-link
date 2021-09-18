import { decode as decodeProtobuf } from "./protobuf/decoder";
import { decode as decodeProtocol } from "./protocol/decode";

const createMessage = (messages, typeId) => {
  const messageTypes =
    messages.nested.hw.nested.trezor.nested.messages.nested.MessageType.values;
  const messageType = Object.keys(messageTypes)
    .find((type) => messageTypes[type] === typeId)
    .replace("MessageType_", "");

  const accessor = `hw.trezor.messages.${messageType}`;
  const Message = messages.lookupType(accessor);

  return {
    Message,
    messageType,
  };
};

export function receiveOne(messages: any, data: Buffer) {
  const { typeId, buffer } = decodeProtocol(data);
  const { Message, messageType } = createMessage(messages, typeId);

  const message = decodeProtobuf(Message, buffer);

  return {
    message,
    type: messageType,
  };
}
