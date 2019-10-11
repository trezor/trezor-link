import * as ByteBuffer from "bytebuffer";

interface DecodeOptions {
  trezorFormat: boolean;
}

export const decode = (data: Buffer, { trezorFormat }: DecodeOptions) => {
  const byteBuffer = ByteBuffer.concat([data]);
  const typeId = byteBuffer.readUint16();

  byteBuffer.readUint32(); // length, ignoring

  if (!trezorFormat) {
    return {
      typeId,
      buffer: byteBuffer.toBuffer(),
    };
  }
};
