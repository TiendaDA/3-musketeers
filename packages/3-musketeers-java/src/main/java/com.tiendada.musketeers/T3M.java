package com.tiendada.musketeers;

import com.tiendada.musketeers.provider.Provider;
import com.tiendada.musketeers.provider.request.IdentifyRequest;
import com.tiendada.musketeers.provider.request.TrackRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class T3M {
  private final Map<String, Provider> providers;

  public T3M() {
    this.providers = new HashMap<>();
  }

  public T3M registerProvider(Provider provider) {
    this.providers.put(provider.getName(), provider);
    return this;
  }

  public T3M deregisterProvider(String providerName) {
    this.providers.remove(providerName);
    return this;
  }

  public T3M identify(IdentifyRequest request) {
    for (Provider provider : this.providers.values()) {
      provider.identify(request);
    }
    return this;
  }

  public T3M track(List<TrackRequest> requests) {
    for (TrackRequest request : requests) {
      for (Provider provider : this.providers.values()) {
        provider.track(request);
      }
    }
    return this;
  }
}
