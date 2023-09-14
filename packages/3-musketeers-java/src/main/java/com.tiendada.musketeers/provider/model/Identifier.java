package com.tiendada.musketeers.provider.model;

import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Identifier {
  Map<String, Map<String, String>> providers;
}
