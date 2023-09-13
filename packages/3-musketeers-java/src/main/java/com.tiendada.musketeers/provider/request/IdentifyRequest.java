package com.tiendada.musketeers.provider.request;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IdentifyRequest {
  String identifier;
  String userId;
  Map<String, Object> userAttributes;
}
