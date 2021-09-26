import { Type, Message, Field } from "protobufjs";
import { isPrimitiveField } from "../../utils/protobuf";

const transform = (field: Field, value: any) => {
  // [compatibility]: optional undefined keys should be null. Example: Features.fw_major.
  if (field.optional && typeof value === "undefined") {
    return null;
  }

  if (field.type === "bytes") {
    return value.toString("hex");
  }

  // [compatibility]
  if (field.long) {
    return value.toNumber();
  }

  return value;
};

function messageToJSON(Message: Message, fields: Type["fields"]) {
  // get rid of Message.prototype references
  const { ...message } = Message;

  const res = {};

  for (const key in fields) {
    const field = fields[key];
    const value = message[key];

    /* istanbul ignore else  */
    if (field.repeated) {
      /* istanbul ignore else  */
      if (isPrimitiveField(field.type)) {
        res[key] = value.map((v: any) => transform(field, v));
      }
      // [compatibility]: keep array enums as array of numbers.
      else if ("valuesById" in field.resolvedType) {
        res[key] = value;
      } else if ("fields" in field.resolvedType) {
        res[key] = value.map((v: any) =>
          messageToJSON(v, (field.resolvedType as Type).fields)
        );
      } else {
        throw new Error(`case not handled for repeated key: ${key}`);
      }
    } else if (isPrimitiveField(field.type)) {
      res[key] = transform(field, value);
    }
    // enum type
    else if ("valuesById" in field.resolvedType) {
      res[key] = field.resolvedType.valuesById[value];
    }
    // message type
    else if (field.resolvedType.fields) {
      res[key] = messageToJSON(value, field.resolvedType.fields);
    } else {
      throw new Error(`case not handled: ${key}`);
    }
  }

  return res;
}

export const decode = (Message: Type, data: Buffer) => {
  const decoded = Message.decode(data);
  return messageToJSON(decoded, decoded.$type.fields);
};
