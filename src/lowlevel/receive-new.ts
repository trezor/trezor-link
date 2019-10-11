import * as ByteBuffer from "bytebuffer";
import { Root } from "protobufjs";

import { decode as decodeProtobuf } from "./protobuf/decoder";
import { decode as decodeProtocol } from "./protocol/decode";
import { createMessageFromType } from '../lowlevel/protobuf/parse_protocol-new';


const MESSAGE_HEADER_BYTE = 0x23;


export function receiveOne(messages: Root, data: Buffer) {
  const { typeId, buffer } = decodeProtocol(data, {
    trezorFormat: false,
  });
  const { Message, messageType } = createMessageFromType(messages, typeId);
  const message = decodeProtobuf(Message, buffer);

  return {
    message,
    type: messageType,
  };
}


// Parses first raw input that comes from Trezor and returns some information about the whole message.
function parseFirstInput(bytes: ArrayBuffer) {
  // convert to ByteBuffer so it's easier to read
  const byteBuffer = ByteBuffer.wrap(bytes);

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
  // todo:
  received.reset();
  const a = received.toArrayBuffer();
  const b = ByteBuffer.wrap(a);
  const { Message, messageType } = createMessageFromType(messages, typeId);
  const message = decodeProtobuf(Message, b.buffer);
  return {
    message,
    type: messageType,
  };
}
