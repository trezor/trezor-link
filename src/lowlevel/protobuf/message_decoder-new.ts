import { Enum } from "protobufjs";

// todo:
const transform = (field: any, value: any) => {
  if (field.type === "bytes") {
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
export function messageToJSON(input: any) {
  const { $type, ...message } = input;
  const res = {};

  for (const key in $type.fields) {
    const field = $type.fields[key];
    const value = message[key];
    if (primitiveTypes.includes(field.type)) {
      if (field.repeated) {
        res[key] = value.map((v, i) => transform(field, value[i]));
      } else {
        res[key] = transform(field, value);
      }
      continue;
    } else if (field.resolvedType instanceof Enum) {
      if (field.repeated) {
        res[key] = value.map((v, i) => v);
      } else {
        res[key] = field.resolvedType.valuesById[value];
      }
    }
    // else if (value instanceof Buffer) {
    //   res[key] = value.toString('hex');
    // } else if (value instanceof Long) {
    //   res[key] = value.toNumber();
    // }
    else if (Array.isArray(value)) {
      const decodedArr = value.map((i) => {
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
        if (typeof i === "object") {
          return messageToJSON(i);
        }
        return i;
      });
      res[key] = decodedArr;
    } else if (typeof value === "object") {
      res[key] = messageToJSON(value);
    } else {
      res[key] = value;
    }
  }
  return res;
}
