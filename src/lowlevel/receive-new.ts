import { decode as decodeProtobuf } from "./protobuf/decoder";
import { decode as decodeProtocol } from "./protocol/decode";

import { ByteBuffer } from "protobufjs-old-fixed-webpack";


const HEADER_SIZE = 1 + 1 + 4 + 2;
const MESSAGE_HEADER_BYTE = 0x23;
const BUFFER_SIZE = 63;


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
  const { typeId, buffer } = decodeProtocol(data, { trezorFormat: false });
  const { Message, messageType } = createMessage(messages, typeId);

  const message = decodeProtobuf(Message, buffer);

  return {
    message,
    type: messageType,
  };
}


// Parses first raw input that comes from Trezor and returns some information about the whole message.
function parseFirstInput(bytes: ArrayBuffer): any {
  // convert to ByteBuffer so it's easier to read
  const byteBuffer: ByteBuffer = ByteBuffer.concat([bytes]);
  // checking first two bytes
  const sharp1: number = byteBuffer.readByte();
  const sharp2: number = byteBuffer.readByte();

  if (sharp1 !== MESSAGE_HEADER_BYTE || sharp2 !== MESSAGE_HEADER_BYTE) {
    throw new Error(`Didn't receive expected header signature.`);
  }

  // reading things from header
  const typeId: number = byteBuffer.readUint16();
  const length: number = byteBuffer.readUint32();
  // creating a new buffer with the right size
  const res = new ByteBuffer(length);
  res.append(byteBuffer);
  return { partialInput: res, length, typeId };
}

async function receiveRest(
  parsedInput: any,
  receiver: () => Promise<ArrayBuffer>,
  expectedLength
): Promise<void> {
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

// Receives the whole message as a raw data buffer (but without headers or type info)
async function receiveBuffer(
  receiver: () => Promise<ArrayBuffer>
): Promise<any> {
  const data = await receiver();
  const { partialInput, length, typeId } = parseFirstInput(data);

  await receiveRest(partialInput, receiver, length);
  return { received: partialInput, typeId };
}

// Reads data from device and returns decoded message, that can be sent back to trezor.js
export async function receiveAndParse(
  messages: any,
  receiver: () => Promise<ArrayBuffer>
): Promise<any> {

  const { received, typeId } = await receiveBuffer(receiver);
  received.reset();
  received.toArrayBuffer();
  const buffer = received;
  const { Message, messageType } = createMessage(messages, typeId);

  return {
    message: decodeProtobuf(Message, buffer.buffer),
    type: messageType,
  }
}