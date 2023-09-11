package com.tiendada.musketeers.provider;

import java.time.OffsetDateTime;
import java.util.Map;

public interface Provider {
  void identify(String identifier, String userId, Map<String, Object> attributes);

  void track(
      String identifier,
      String userId,
      String eventName,
      OffsetDateTime timestamp,
      Map<String, Object> attributes);
}
