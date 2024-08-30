import clone from 'rfdc';

export function deepClone<T>(obj: T): T {
  return clone()(obj);
}
