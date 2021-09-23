import * as ByteBuffer from "bytebuffer";

export const decode = (data, { trezorFormat }) => {
    const byteBuffer: ByteBuffer = ByteBuffer.concat([data]);
    const typeId: number = byteBuffer.readUint16();

    byteBuffer.readUint32(); // length, ignoring

    if (!trezorFormat) {
        return {
            typeId,
            buffer: byteBuffer.toBuffer()
        }
    }


}

