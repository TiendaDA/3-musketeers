package com.tiendada.musketeers.provider;

import com.tiendada.musketeers.provider.request.IdentifyRequest;
import com.tiendada.musketeers.provider.request.TrackRequest;

public interface Provider {
  void identify(IdentifyRequest request);

  void track(TrackRequest request);
}
