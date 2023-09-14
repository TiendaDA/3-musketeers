package com.tiendada.musketeers.provider;

import com.tiendada.musketeers.provider.model.Identifier;
import com.tiendada.musketeers.provider.request.IdentifyRequest;
import com.tiendada.musketeers.provider.request.TrackRequest;
import java.util.Map;

public abstract class Provider {
  public abstract void identify(IdentifyRequest request);

  public abstract void track(TrackRequest request);

  public abstract String getName();

  protected Map<String, String> getProviderIdentifier(Identifier identifier) {
    var providers = identifier.getProviders();
    return providers.get(this.getName());
  }
}
