package com.tiendada.musketeers.provider.request;

import com.tiendada.musketeers.provider.model.Identifier;
import com.tiendada.musketeers.provider.model.UTMParams;
import java.time.OffsetDateTime;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrackRequest {
  Identifier identifier;
  String eventName;
  OffsetDateTime timestamp;
  Map<String, Object> eventAttributes;
  UTMParams utmParams;
}
