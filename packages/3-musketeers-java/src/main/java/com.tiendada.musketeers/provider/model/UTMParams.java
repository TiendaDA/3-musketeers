package com.tiendada.musketeers.provider.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UTMParams {
  String utmSource;
  String utmMedium;
  String utmCampaign;
  String utmTerm;
  String utmContent;
}
