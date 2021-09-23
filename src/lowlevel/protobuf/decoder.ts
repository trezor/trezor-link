import { Enum } from "protobufjs";
import * as ByteBuffer from 'bytebuffer';

// todo:
const transform = (field: any, value: any) => {
  if (field.type === "bytes") {
    if (!value) return null;
    if (Array.isArray(value)) {
      // ???
      if (!value.length) return null;

      return value.map(v => v.toString('hex'));
    }
    return value.toString("hex");
  }
  if (field.long) {
    return value.toNumber();
  }

  return value;
};

const primitiveTypes = [
  "string",
  "boolean",
  "uint32",
  "uint64",
  "sint32",
  "sint64",
  "bool",
  "bytes",
];

/*
  Legacy outbound middleware
*/
function messageToJSON(Message: any, payload) {
  if (!Message) return Message; // Message null? but this smells

  const { $type, ...message } = Message;
  const res = {};
  for (const key in $type.fields) {
    const field = $type.fields[key];
    const value = Message[key];

    if (primitiveTypes.includes(field.type)) {
      if (field.optional && typeof payload[key] === 'undefined') {
        res[key] = null;
      }
      else if (field.repeated) {
        res[key] = payload[key].map(v => transform(field, v));
      } else {
        res[key] = transform(field, payload[key]);
      }
    } else if (field.resolvedType instanceof Enum) {
      if (field.repeated) {
        res[key] = value.map((v, i) => v);
      } else {
        res[key] = field.resolvedType.valuesById[value];
      }
    }
    else if (Array.isArray(value)) {
      const decodedArr = value.map((v, i) => {
        // was not handled, for example MultisigRedeemScriptType has this:
        //   {
        //     "rule": "repeated",
        //     "options": {},
        //     "type": "bytes",
        //     "name": "signatures",
        //     "id": 2
        // },
        // interesting is that connect sends it as string[] ??
        // if (i instanceof ByteBuffer) {
        //   return i.toHex();
        // }
        if (typeof v === "object") {
          return messageToJSON(v, payload[key][i]);
        }
        return i;
      });
      res[key] = decodedArr;
    } else if (typeof value === "object") {

      res[key] = messageToJSON(value, payload[key]);
    } else {

      res[key] = payload[key];
    }
  }

  return res;
}

export const decode = (Message, data) => {
  const m = Message.decode(data);
  const asObj = Message.toObject(m, {
    defaults: false,
    enums: String,  // enums as string names
    // longs: String,  // longs as strings (requires long.js)
    // bytes: String,  // bytes as base64 encoded strings
    // defaults: true, // includes default values
    arrays: true,   // populates empty arrays (repeated fields) even if defaults=false
    objects: true,  // populates empty objects (map fields) even if defaults=false
    oneofs: true

  });

  return messageToJSON(m, asObj);
}