import * as ByteBuffer from "bytebuffer";

const HEADER_SIZE = 1 + 1 + 4 + 2;
const MESSAGE_HEADER_BYTE = 0x23;
const BUFFER_SIZE = 63;

export const encode = (
  data,
  { addTrezorHeaders, trezorFormat, messageType }
) => {
  const headerSize: number = HEADER_SIZE; // should be 8
  // @ts-ignore
  const bytes: Uint8Array = new Uint8Array(data);
  const fullSize: number = headerSize - 2 + bytes.length;

  const encodedByteBuffer = new ByteBuffer(fullSize);

  if (addTrezorHeaders) {
    // 2*1 byte
    encodedByteBuffer.writeByte(MESSAGE_HEADER_BYTE);
    encodedByteBuffer.writeByte(MESSAGE_HEADER_BYTE);
  }

  // 2 bytes
  encodedByteBuffer.writeUint16(messageType);

  // 4 bytes (so 8 in total)
  encodedByteBuffer.writeUint32(bytes.length);

  // then put in the actual message
  encodedByteBuffer.append(bytes);

  // and convert to uint8 array
  // (it can still be too long to send though)
  const encoded: Uint8Array = new Uint8Array(encodedByteBuffer.buffer);

  if (!trezorFormat) {
    // return bytes;
    return Buffer.from(encoded);
  }

  const result = [];
  const size = BUFFER_SIZE;

  // How many pieces will there actually be
  const count = Math.floor((bytes.length - 1) / size) + 1;

  // slice and dice
  for (let i = 0; i < count; i++) {
    const slice: Uint8Array = bytes.subarray(i * size, (i + 1) * size);
    const newArray: Uint8Array = new Uint8Array(size);
    newArray.set(slice);
    result.push(newArray.buffer);
  }

  return result;
};
