import {DataLayerHelper, DataLayerListener} from './data-layer-helper';
import {Provider} from './provider';
import {handleInit, handleTrack} from './command';

const providers: Provider[] = [];

const listener: DataLayerListener = (_, args_) => {
  const args = [...args_].splice(0, args_.length);
  const cmd = args.shift();
  switch (cmd) {
    case 'init':
      const providerName = args.shift();
      handleInit(providers, providerName, args);
      break;
    case 'track':
      handleTrack(providers, args);
      break;
  }
};

const dq = window.dataQueue || [];

new DataLayerHelper(dq, {
  listener,
  listenToPast: true,
  processNow: true,
  debugMode: true,
});
