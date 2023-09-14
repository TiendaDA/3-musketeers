package com.tiendada.musketeers.provider.request;

import com.tiendada.musketeers.provider.model.Identifier;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IdentifyRequest {
  Identifier identifier;
  Map<String, Object> userAttributes;
}
