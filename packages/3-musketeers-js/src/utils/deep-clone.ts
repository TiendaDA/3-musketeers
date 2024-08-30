type Cloneable =
  | Set<unknown>
  | Map<unknown, unknown>
  | Date
  | RegExp
  | Array<unknown>
  | object
  | string
  | number
  | boolean
  | null
  | undefined
  | unknown;

export default function clone<T extends Cloneable>(obj: T): T {
  let result: unknown = obj;
  const type = {}.toString.call(obj).slice(8, -1);

  if (type === 'Set') {
    return new Set(
      [...(obj as Set<unknown>)].map((value) => clone(value))
    ) as T;
  }

  if (type === 'Map') {
    return new Map(
      [...(obj as Map<unknown, unknown>)].map(([key, value]) => [
        clone(key),
        clone(value),
      ])
    ) as T;
  }

  if (type === 'Date') {
    return new Date((obj as Date).getTime()) as T;
  }

  if (type === 'RegExp') {
    return RegExp((obj as RegExp).source, getRegExpFlags(obj as RegExp)) as T;
  }

  if (type === 'Array' || type === 'Object') {
    result = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      // include prototype properties
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        (result as Record<string, unknown>)[key] = clone(
          (obj as Record<string, unknown>)[key]
        );
      }
    }
  }

  return result as T;
}

function getRegExpFlags(regExp: RegExp): string {
  if (typeof regExp.flags === 'string') {
    return regExp.flags;
  } else {
    const flags: string[] = [];
    regExp.global && flags.push('g');
    regExp.ignoreCase && flags.push('i');
    regExp.multiline && flags.push('m');
    regExp.sticky && flags.push('y');
    regExp.unicode && flags.push('u');
    return flags.join('');
  }
}
