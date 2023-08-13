/* eslint-disable @typescript-eslint/no-explicit-any */
import {log, setDebugMode} from '../logging';
import {
  expandKeyValue,
  isArguments,
  isArray,
  isPlainObject,
  isString,
  merge,
} from '../utils';

export type DataLayerListener = (
  model: Record<string, any>,
  args: any[]
) => void;

export type DataLayerHelperOptions = {
  listener?: DataLayerListener;
  listenToPast?: boolean;
  processNow?: boolean;
  debugMode?: boolean;
};

function buildAbstractModelInterface_(dataLayerHelper: DataLayerHelper) {
  return {
    set: (key: string, value: any) => {
      merge(expandKeyValue(key, value), dataLayerHelper.model_);
    },
    get: (key: string) => {
      return dataLayerHelper.get(key);
    },
  };
}

function processCommand_(command: any, model) {
  if (!isString(command[0])) {
    log.warn(
      `Error processing command, no command was run. The first ` +
        `argument must be of type string, but was of type ` +
        `${typeof command[0]}.\nThe command run was ${command}`
    );
  }
  const path = command[0].split('.');
  const method = path.pop();
  const args = command.slice(1);
  let target = model;
  for (let i = 0; i < path.length; i++) {
    if (target[path[i]] === undefined) {
      log.warn(
        `Error processing command, no command was run as the ` +
          `object at ${path} was undefined.\nThe command run was ${command}`
      );
      return;
    }
    target = target[path[i]];
  }
  try {
    target[method](...args);
  } catch (e) {
    // Catch any exception, so we don't drop subsequent updates.
    log.error(
      `An exception was thrown by the method ` +
        `${method}, so no command was run.\nThe method was called on the ` +
        `data layer object at the location ${path}.`
    );
  }
}

export class DataLayerHelper {
  dataLayer_: any[];
  listener_: DataLayerListener;
  listenToPast_: boolean;
  processed_: boolean;
  executingListener_: boolean;
  model_: Record<string, any>;
  unprocessed_: any[];
  abstractModelInterface_: {
    set: (key: string, value: any) => void;
    get: (key: string) => any;
  };

  constructor(dataLayer: any[], options: DataLayerHelperOptions = {}) {
    this.dataLayer_ = dataLayer;
    this.listener_ = options.listener || (() => {});
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

    this.dataLayer_.push = (...args: any[]) => {
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
        `Process has already been run. This method should only ` +
          `run a single time to prepare the helper.`
      );
    }

    // Register a processor for set command.
    /*this.registerProcessor('set', function () {
      let toMerge = {};
      if (arguments.length === 1 && type(arguments[0]) === 'object') {
        toMerge = arguments[0];
      } else if (arguments.length === 2 && type(arguments[0]) === 'string') {
        // Maintain consistency with how objects are merged
        // outside the set command (overwrite or recursively merge).
        toMerge = expandKeyValue(arguments[0], arguments[1]);
      }
      return toMerge;
    });*/
    // Mark helper as having been processed.
    this.processed_ = true;

    const startingLength = this.dataLayer_.length;
    for (let i = 0; i < startingLength; i++) {
      // Run the commands one at a time to maintain the correct
      // length of the queue on each command.
      this.processStates_([this.dataLayer_[i]], !this.listenToPast_);
    }
  }

  get(key: string) {
    let target = this.model_;
    const split = key.split('.');
    for (let i = 0; i < split.length; i++) {
      if (target[split[i]] === undefined) return undefined;
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

  processStates_(states: any[], skipListener = false) {
    if (!this.processed_) {
      return;
    }
    this.unprocessed_.push(...states);

    if (this.executingListener_) {
      return;
    }
    // Checking executingListener here protects against multiple levels of
    // loops trying to process the same queue. This can happen if the listener
    // itself is causing new states to be pushed onto the dataLayer.
    while (this.unprocessed_.length > 0) {
      const update = this.unprocessed_.shift();
      if (isArray(update)) {
        processCommand_(update, this.model_);
      } else if (isArguments(update)) {
        // const newStates = this.processArguments_(update);
        // this.unprocessed_.push(...newStates);
        // continue;
      } else if (typeof update == 'function') {
        try {
          update.call(this.abstractModelInterface_);
        } catch (e) {
          // Catch any exceptions to we don't drop subsequent updates.
          log.error(
            `An exception was thrown when running the method ` +
              `${update}, execution was skipped.`,
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
}
