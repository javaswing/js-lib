export function get(object: any, path: string): any {
  const keys = path.split(".");
  let result = object;

  keys.forEach((key) => {
    result = result[key] ?? "";
  });

  return result;
}

export function pick<T, U extends keyof T>(
  obj: T,
  keys: ReadonlyArray<U>,
  ignoreUndefined?: boolean
) {
  return keys.reduce((ret, key) => {
    if (!ignoreUndefined || obj[key] !== undefined) {
      ret[key] = obj[key];
    }
    return ret;
  }, {} as Writeable<Pick<T, U>>);
}

export const toArray = <T>(item: T | T[]): T[] =>
  Array.isArray(item) ? item : [item];

const camelizeRE = /-(\w)/g;

export const camelize = (str: string): string =>
  str.replace(camelizeRE, (_, c) => c.toUpperCase());

export const kebabCase = (str: string) =>
  str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "");

export function padZero(num: Numeric, targetLength = 2): string {
  let str = num + "";

  while (str.length < targetLength) {
    str = "0" + str;
  }

  return str;
}

export function formatNumber(
  value: string,
  allowDot = true,
  allowMinus = true
) {
  if (allowDot) {
    value = trimExtraChar(value, ".", /\./g);
  } else {
    value = value.split(".")[0];
  }

  if (allowMinus) {
    value = trimExtraChar(value, "-", /-/g);
  } else {
    value = value.replace(/-/, "");
  }

  const regExp = allowDot ? /[^-0-9.]/g : /[^-0-9]/g;

  return value.replace(regExp, "");
}
