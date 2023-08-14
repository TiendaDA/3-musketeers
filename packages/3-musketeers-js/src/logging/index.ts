export enum LogLevel {
  INFO = 1,
  WARNING = 2,
  ERROR = 3,
}

export type LogMessage = string | number | undefined | object;

let debugMode = false;

export function setDebugMode(debugMode_: boolean) {
  debugMode = debugMode_;
}

export const log = {
  info: (...message: LogMessage[]) => log_(LogLevel.INFO, ...message),
  warn: (...message: LogMessage[]) => log_(LogLevel.WARNING, ...message),
  error: (...message: LogMessage[]) => log_(LogLevel.ERROR, ...message),
};

function log_(logLevel: LogLevel, ...message: LogMessage[]) {
  if (debugMode) {
    const prelude = ['🤺 %c[3-musketeers]'];
    switch (logLevel) {
      case LogLevel.INFO:
        prelude.push('color: #06989A; font-weight: 600');
        console.log(...prelude, ...message);
        break;
      case LogLevel.WARNING:
        prelude.push('color: #C4A000; font-weight: 600');
        console.warn(...prelude, ...message);
        break;
      case LogLevel.ERROR:
        prelude.push('color: #CC0000; font-weight: 600');
        console.error(...prelude, ...message);
        break;
      default:
        break;
    }
  }
}
