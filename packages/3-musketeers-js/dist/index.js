(() => {
  // src/logging/index.ts
  var debugMode = false;
  function setDebugMode(debugMode_) {
    debugMode = debugMode_;
  }
  var log = {
    info: (...message) => log_(1 /* INFO */, ...message),
    warn: (...message) => log_(2 /* WARNING */, ...message),
    error: (...message) => log_(3 /* ERROR */, ...message)
  };
  function log_(logLevel, ...message) {
    if (debugMode) {
      const prelude = ["\u{1F93A} %c[3-musketeers]"];
      switch (logLevel) {
        case 1 /* INFO */:
          prelude.push("color: #06989A; font-weight: 600");
          console.log(...prelude, ...message);
          break;
        case 2 /* WARNING */:
          prelude.push("color: #C4A000; font-weight: 600");
          console.warn(...prelude, ...message);
          break;
        case 3 /* ERROR */:
          prelude.push("color: #CC0000; font-weight: 600");
          console.error(...prelude, ...message);
          break;
        default:
      }
    }
  }

  // src/utils/index.ts
  var TYPE_RE_ = /\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)]/;
  function type(value) {
    if (value == null)
      return String(value);
    const match = TYPE_RE_.exec(Object.prototype.toString.call(Object(value)));
    if (match)
      return match[1].toLowerCase();
    return "object";
  }
  function isArray(value) {
    return type(value) === "array";
  }
  function isString(value) {
    return type(value) === "string";
  }
  function hasOwn(value, key) {
    return Object.prototype.hasOwnProperty.call(Object(value), key);
  }
  function isPlainObject(value) {
    if (!value || type(value) != "object" || // Nulls, dates, etc.
    value.nodeType || // DOM nodes.
    value == value.window) {
      return false;
    }
    try {
      if (value.constructor && !hasOwn(value, "constructor") && !hasOwn(value.constructor.prototype, "isPrototypeOf")) {
        return false;
      }
    } catch (e) {
      return false;
    }
    let key;
    for (key in value) {
    }
    return key === void 0 || hasOwn(value, key);
  }
  function isArguments(value) {
    return type(value) === "arguments";
  }
  function merge(from, to) {
    const allowMerge = !from["_clear"];
    for (const property in from) {
      if (hasOwn(from, property)) {
        const fromProperty = from[property];
        if (isArray(fromProperty) && allowMerge) {
          if (!isArray(to[property]))
            to[property] = [];
          merge(fromProperty, to[property]);
        } else if (isPlainObject(fromProperty) && allowMerge) {
          if (!isPlainObject(to[property]))
            to[property] = {};
          merge(fromProperty, to[property]);
        } else {
          to[property] = fromProperty;
        }
      }
    }
    delete to["_clear"];
  }
  function expandKeyValue(key, value) {
    const result = {};
    let target = result;
    const split = key.split(".");
    for (let i = 0; i < split.length - 1; i++) {
      target = target[split[i]] = {};
    }
    target[split[split.length - 1]] = value;
    return result;
  }
  function loadScript(src, options = {}) {
    const { async } = options;
    const script = document.createElement("script");
    script.async = !!async;
    script.setAttribute("src", src);
    document.body.appendChild(script);
  }

  // src/data-layer-helper/index.ts
  function buildAbstractModelInterface_(dataLayerHelper) {
    return {
      set: (key, value) => {
        merge(expandKeyValue(key, value), dataLayerHelper.model_);
      },
      get: (key) => {
        return dataLayerHelper.get(key);
      }
    };
  }
  function processCommand_(command, model) {
    if (!isString(command[0])) {
      log.warn(
        `Error processing command, no command was run. The first argument must be of type string, but was of type ${typeof command[0]}.
The command run was ${command}`
      );
    }
    const path = command[0].split(".");
    const method = path.pop();
    const args = command.slice(1);
    let target = model;
    for (let i = 0; i < path.length; i++) {
      if (target[path[i]] === void 0) {
        log.warn(
          `Error processing command, no command was run as the object at ${path} was undefined.
The command run was ${command}`
        );
        return;
      }
      target = target[path[i]];
    }
    try {
      target[method](...args);
    } catch (e) {
      log.error(
        `An exception was thrown by the method ${method}, so no command was run.
The method was called on the data layer object at the location ${path}.`
      );
    }
  }
  var DataLayerHelper = class {
    constructor(dataLayer, options = {}) {
      this.dataLayer_ = dataLayer;
      this.listener_ = options.listener || (() => {
      });
      this.listenToPast_ = !!options.listenToPast;
      this.processed_ = false;
      this.executingListener_ = false;
      this.model_ = {};
      this.unprocessed_ = [];
      this.abstractModelInterface_ = buildAbstractModelInterface_(this);
      if (options.debugMode) {
        setDebugMode(true);
      }
      const oldPush = this.dataLayer_.push;
      this.dataLayer_.push = (...args) => {
        const states = [].slice.call(args, 0);
        const result = oldPush.apply(this.dataLayer_, states);
        this.processStates_(states);
        return result;
      };
      if (options.processNow) {
        this.process();
      }
    }
    process() {
      if (this.processed_) {
        log.error(
          `Process has already been run. This method should only run a single time to prepare the helper.`
        );
      }
      this.processed_ = true;
      const startingLength = this.dataLayer_.length;
      for (let i = 0; i < startingLength; i++) {
        this.processStates_([this.dataLayer_[i]], !this.listenToPast_);
      }
    }
    get(key) {
      let target = this.model_;
      const split = key.split(".");
      for (let i = 0; i < split.length; i++) {
        if (target[split[i]] === void 0)
          return void 0;
        target = target[split[i]];
      }
      return target;
    }
    /*processArguments_(args: any[]) {
      // Run all registered processors associated with this command.
      const states = [];
      // const name = args[0];
      if (this.commandProcessors_[name]) {
        // Cache length so as not to run processors registered
        // by other processors after the call.
        // This could happen if somebody calls the registerProcessor() method
        // within a processor call.
        const length = this.commandProcessors_[name].length;
        for (let i = 0; i < length; i++) {
          const callback = this.commandProcessors_[name][i];
          states.push(
            callback.apply(this.abstractModelInterface_, [].slice.call(args, 1))
          );
        }
      }
      return states;
    }*/
    processStates_(states, skipListener = false) {
      if (!this.processed_) {
        return;
      }
      this.unprocessed_.push(...states);
      if (this.executingListener_) {
        return;
      }
      while (this.unprocessed_.length > 0) {
        const update = this.unprocessed_.shift();
        if (isArray(update)) {
          processCommand_(update, this.model_);
        } else if (isArguments(update)) {
        } else if (typeof update == "function") {
          try {
            update.call(this.abstractModelInterface_);
          } catch (e) {
            log.error(
              `An exception was thrown when running the method ${update}, execution was skipped.`,
              e
            );
          }
        } else if (isPlainObject(update)) {
          for (const key in update) {
            merge(expandKeyValue(key, update[key]), this.model_);
          }
        } else {
          continue;
        }
        if (!skipListener) {
          this.executingListener_ = true;
          this.listener_(this.model_, update);
          this.executingListener_ = false;
        }
      }
    }
  };

  // src/provider/provider.ts
  var Provider = class {
    static {
      this.providerName = "provider";
    }
  };

  // src/provider/google-analytics/index.ts
  var GoogleAnalytics = class _GoogleAnalytics extends Provider {
    static {
      this.providerName = "google-analytics";
    }
    init(tagId) {
      log.info("[INIT]", `${_GoogleAnalytics.providerName} (${tagId})`);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", /* @__PURE__ */ new Date());
      window.gtag("config", "G-JJYRJMRN07");
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${tagId}`);
    }
    ready() {
      return !!window.gtag;
    }
    track(name) {
      window.gtag("");
      log.info("[TRACK]", name);
    }
  };

  // src/provider/index.ts
  function getProvider(providerName) {
    switch (providerName) {
      case GoogleAnalytics.providerName:
        return new GoogleAnalytics();
    }
    return void 0;
  }

  // src/command/index.ts
  function handleInit(providers2, providerName, args) {
    const provider = getProvider(providerName);
    if (!provider) {
      log.error(`Provider '${providerName}' not found`);
      return;
    }
    providers2.push(provider);
    provider.init(...args);
  }
  function handleTrack(providers2, args) {
    providers2.forEach((p) => {
      p.track(...args);
    });
  }

  // src/index.ts
  var providers = [];
  var listener = (_, args_) => {
    const args = [...args_].splice(0, args_.length);
    const cmd = args.shift();
    switch (cmd) {
      case "init":
        const providerName = args.shift();
        handleInit(providers, providerName, args);
        break;
      case "track":
        handleTrack(providers, args);
        break;
    }
  };
  var dq = window.dataQueue || [];
  new DataLayerHelper(dq, {
    listener,
    listenToPast: true,
    processNow: true,
    debugMode: true
  });
})();
