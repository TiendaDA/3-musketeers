import {Provider, ProviderClass, ProviderImpl} from './provider';
import {DataLayerHelper, DataLayerListener} from '../data-layer-helper';
import {handleIdentify, handlePageView, handleTrack} from './command';
import {log} from '../logging';

export class Tiendada3musketeers {
  availableProviders: ProviderClass[];
  providers: Provider[];
  helper: DataLayerHelper;

  constructor(availableProviders: ProviderClass[] = []) {
    this.availableProviders = availableProviders;
    this.providers = [];
    const dq = window.dataQueue || [];
    this.helper = new DataLayerHelper(dq, {
      listener: this.listener,
      listenToPast: true,
      processNow: true,
      debugMode: true,
    });
  }

  getProviderInstance(providerName: string): Provider | undefined {
    const providerCls = this.availableProviders.find(
      (p: typeof Provider) => p.providerName === providerName
    ) as ProviderImpl;

    if (!providerCls) {
      return undefined;
    }

    return new providerCls() as Provider;
  }

  listener: DataLayerListener = (_, args_) => {
    const args = [...args_].splice(0, args_.length);
    const cmd = args.shift();
    switch (cmd) {
      case 'init':
        const providerName = args.shift();
        const provider = this.getProviderInstance(providerName);
        if (!provider) {
          log.error(`Provider '${providerName}' not found`);
          return;
        }

        this.providers.push(provider);
        provider.init(...args);
        break;
      case 'track':
        handleTrack(this.providers, args);
        break;
      case 'page':
        handlePageView(this.providers, args);
        break;
      case 'identify':
        handleIdentify(this.providers, args);
        break;
    }
  };
}
