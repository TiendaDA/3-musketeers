/* eslint-disable @typescript-eslint/no-explicit-any */
export function waitFor(validate: () => boolean, callback: () => void) {
  if (validate()) callback();
  else {
    setTimeout(() => waitFor(validate, callback), 100);
  }
}

const TYPE_RE_ =
  /\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)]/;

export function type(value: unknown): string {
  if (value == null) return String(value);
  const match = TYPE_RE_.exec(Object.prototype.toString.call(Object(value)));
  if (match) return match[1].toLowerCase();
  return 'object';
}

export function isArray(value: unknown): boolean {
  return type(value) === 'array';
}

export function isString(value: unknown): boolean {
  return type(value) === 'string';
}

function hasOwn(value: unknown, key: string) {
  return Object.prototype.hasOwnProperty.call(Object(value), key);
}

export function isPlainObject(value: any): boolean {
  if (
    !value ||
    type(value) != 'object' || // Nulls, dates, etc.
    value.nodeType || // DOM nodes.
    value == value.window
  ) {
    // Window objects.
    return false;
  }
  try {
    // According to jQuery, we must check for the presence of the constructor
    // property in IE. If the constructor property is inherited and isn't an
    // Object, this isn't a plain object.
    if (
      value.constructor &&
      !hasOwn(value, 'constructor') &&
      !hasOwn(value.constructor.prototype, 'isPrototypeOf')
    ) {
      return false;
    }
  } catch (e) {
    // Some objects will throw an exception when you try to access their
    // constructor. These are never plain objects.
    // See http://bugs.jquery.com/ticket/9897.
    return false;
  }
  // Lastly, we check that all properties are non-inherited.
  // According to jQuery, inherited properties are always enumerated last, so
  // it's safe to only check the last enumerated property.
  let key;
  for (key in value) {
  }
  return key === undefined || hasOwn(value, key);
}

export function isArguments(value: unknown): boolean {
  return type(value) === 'arguments';
}

export function merge(from: any, to: unknown) {
  const allowMerge = !from['_clear'];
  for (const property in from) {
    if (hasOwn(from, property)) {
      const fromProperty = from[property];
      if (isArray(fromProperty) && allowMerge) {
        if (!isArray(to[property])) to[property] = [];
        merge(fromProperty, to[property]);
      } else if (isPlainObject(fromProperty) && allowMerge) {
        if (!isPlainObject(to[property])) to[property] = {};
        merge(fromProperty, to[property]);
      } else {
        to[property] = fromProperty;
      }
    }
  }
  delete to['_clear'];
}

export function expandKeyValue(key: string, value: any) {
  const result = {};
  let target = result;
  const split = key.split('.');
  for (let i = 0; i < split.length - 1; i++) {
    target = target[split[i]] = {};
  }
  target[split[split.length - 1]] = value;
  return result;
}

type LoadScriptOptions = {
  async?: boolean;
  defer?: boolean;
  attributes?: Record<string, string>;
};

export function loadScript(src: string, options: LoadScriptOptions = {}) {
  const {async, defer, attributes} = options;
  const script = document.createElement('script');
  script.async = !!async;
  script.defer = !!defer;

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      script.setAttribute(key, attributes[key]);
    });
  }

  script.setAttribute('src', src);
  document.body.appendChild(script);
}

export function loadScriptRaw(script: string, options: LoadScriptOptions = {}) {
  const {async, attributes, defer} = options;
  const scriptElement = document.createElement('script');

  if (async) scriptElement.async = true;
  if (defer) scriptElement.defer = true;

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      scriptElement.setAttribute(key, attributes[key]);
    });
  }

  scriptElement.appendChild(document.createTextNode(script));

  document.body.appendChild(scriptElement);
}
