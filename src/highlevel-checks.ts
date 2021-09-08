// input checks for high-level transports

import type {
  TrezorDeviceInfoWithSession,
  MessageFromTrezor,
} from "./transport";

export function info(res: any): { version: string; configured: boolean } {
  if (typeof res !== `object` || res == null) {
    throw new Error(`Wrong result type.`);
  }
  const { version } = res;
  if (typeof version !== `string`) {
    throw new Error(`Wrong result type.`);
  }
  const configured = !!res.configured;
  return { version, configured };
}

export function version(version: any): string {
  if (typeof version !== `string`) {
    throw new Error(`Wrong result type.`);
  }
  return version.trim();
}

function convertSession(r: any) {
  if (r == null) {
    return null;
  }
  if (typeof r !== `string`) {
    throw new Error(`Wrong result type.`);
  }
  return r;
}

export function devices(res: any): Array<TrezorDeviceInfoWithSession> {
  if (typeof res !== `object`) {
    throw new Error(`Wrong result type.`);
  }
  if (!(res instanceof Array)) {
    throw new Error(`Wrong result type.`);
  }
  return res.map((o: any): TrezorDeviceInfoWithSession => {
    if (typeof o !== `object` || o == null) {
      throw new Error(`Wrong result type.`);
    }
    const { path } = o;
    if (typeof path !== `string`) {
      throw new Error(`Wrong result type.`);
    }
    const pathS = path.toString();
    return {
      path: pathS,
      session: convertSession(o.session),
      debugSession: convertSession(o.debugSession),
      // @ts-ignore
      product: o.product,
      vendor: o.vendor,
      debug: !!o.debug,
    };
  });
}

export function acquire(res: any): string {
  if (typeof res !== `object` || res == null) {
    throw new Error(`Wrong result type.`);
  }
  const { session } = res;
  if (typeof session !== `string` && typeof session !== `number`) {
    throw new Error(`Wrong result type.`);
  }
  return session.toString();
}

export function call(res: any): MessageFromTrezor {
  if (typeof res !== `object` || res == null) {
    throw new Error(`Wrong result type.`);
  }
  const { type } = res;
  if (typeof type !== `string`) {
    throw new Error(`Wrong result type.`);
  }
  const { message } = res;
  if (typeof message !== `object` || message == null) {
    throw new Error(`Wrong result type.`);
  }
  return { type, message };
}
