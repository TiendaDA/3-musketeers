package com.tiendada.musketeers.provider.customerio;

import com.tiendada.musketeers.http.Http;
import com.tiendada.musketeers.http.HttpOptions;
import com.tiendada.musketeers.http.body.JsonBody;
import com.tiendada.musketeers.http.exc.HttpConfigException;
import com.tiendada.musketeers.provider.Provider;
import com.tiendada.musketeers.provider.model.UTMParams;
import com.tiendada.musketeers.provider.request.IdentifyRequest;
import com.tiendada.musketeers.provider.request.TrackRequest;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class CustomerIODataPipeline extends Provider {
  private static final Logger log = LoggerFactory.getLogger(CustomerIODataPipeline.class);
  public static String name = "CUSTOMERIO_DATA_PIPELINE";
  private final String BASE_URL = "https://cdp.customer.io/v1/";
  private String apiKey;

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void identify(IdentifyRequest request) {
    var identifier = this.getProviderIdentifier(request.getIdentifier());
    if (!this.isValidIdentifier(identifier)) {
      log.debug("Identify: Identifier not found");
      return;
    }

    var url = URI.create(this.BASE_URL).resolve("./identify");
    var context = Map.of("campaign", this.buildCampaign(request.getUtmParams()));
    var body = new HashMap<String, Object>();
    body.put("traits", request.getUserAttributes());
    body.put("context", context);

    if (Objects.nonNull(identifier.get("user_id"))) {
      body.put("userId", identifier.get("user_id"));
    }
    if (Objects.nonNull(identifier.get("anonymous_id"))) {
      body.put("anonymousId", identifier.get("anonymous_id"));
    }

    try {
      var response =
          Http.post(
              HttpOptions.builder()
                  .url(url.toString())
                  .headers(this.buildCredentialHeaders())
                  .body(new JsonBody(body))
                  .build());
      log.info(
          "Identify [identifier=%s][statusCode=%s]"
              .formatted(request.getIdentifier(), response.getStatus()));
    } catch (HttpConfigException | IOException | URISyntaxException e) {
      log.error(
          "Could not Identify [identifier=%s][error=%s]"
              .formatted(request.getIdentifier(), e.getMessage()));
    }
  }

  @Override
  public void track(TrackRequest request) {
    var identifier = this.getProviderIdentifier(request.getIdentifier());
    if (!this.isValidIdentifier(identifier)) {
      log.debug("Track: Identifier not found [eventName=%s]".formatted(request.getEventName()));
      return;
    }

    var url = URI.create(this.BASE_URL).resolve("./track");
    var eventAttributes = request.getEventAttributes();

    var utmParams = request.getUtmParams();
    if (Objects.nonNull(utmParams)) {
      if (Objects.nonNull(utmParams.getUtmCampaign())) {
        eventAttributes.put("utm_campaign", utmParams.getUtmCampaign());
      }
      if (Objects.nonNull(utmParams.getUtmSource())) {
        eventAttributes.put("utm_source", utmParams.getUtmCampaign());
      }
      if (Objects.nonNull(utmParams.getUtmMedium())) {
        eventAttributes.put("utm_medium", utmParams.getUtmCampaign());
      }
      if (Objects.nonNull(utmParams.getUtmTerm())) {
        eventAttributes.put("utm_term", utmParams.getUtmCampaign());
      }
      if (Objects.nonNull(utmParams.getUtmContent())) {
        eventAttributes.put("utm_content", utmParams.getUtmCampaign());
      }
    }

    var context = Map.of("campaign", this.buildCampaign(utmParams));

    var body = new HashMap<String, Object>();
    body.put("event", request.getEventName());
    body.put("properties", eventAttributes);
    body.put("timestamp", request.getTimestamp().toInstant().toEpochMilli());
    body.put("context", context);

    if (Objects.nonNull(identifier.get("user_id"))) {
      body.put("userId", identifier.get("user_id"));
    }
    if (Objects.nonNull(identifier.get("anonymous_id"))) {
      body.put("anonymousId", identifier.get("anonymous_id"));
    }

    try {
      var response =
          Http.post(
              HttpOptions.builder()
                  .url(url.toString())
                  .headers(this.buildCredentialHeaders())
                  .body(new JsonBody(body))
                  .build());
      log.info(
          "Track [identifier=%s][event=%s][statusCode=%s]"
              .formatted(identifier, request.getEventName(), response.getStatus()));
    } catch (HttpConfigException | IOException | URISyntaxException e) {
      log.error("Could not Track [identifier=%s][error=%s]".formatted(identifier, e.getMessage()));
    }
  }

  private Map<String, String> buildCredentialHeaders() {
    var credential = (this.apiKey + ":").getBytes();
    return Map.of("Authorization", "Basic " + Base64.getEncoder().encodeToString(credential));
  }

  private Map<String, String> buildCampaign(UTMParams utmParams) {
    var campaign = new HashMap<String, String>();

    if (Objects.nonNull(utmParams)) {
      if (Objects.nonNull(utmParams.getUtmCampaign())) {
        campaign.put("name", utmParams.getUtmCampaign());
      }
      if (Objects.nonNull(utmParams.getUtmSource())) {
        campaign.put("source", utmParams.getUtmSource());
      }
      if (Objects.nonNull(utmParams.getUtmMedium())) {
        campaign.put("medium", utmParams.getUtmMedium());
      }
      if (Objects.nonNull(utmParams.getUtmTerm())) {
        campaign.put("term", utmParams.getUtmTerm());
      }
      if (Objects.nonNull(utmParams.getUtmContent())) {
        campaign.put("content", utmParams.getUtmContent());
      }
    }

    return campaign;
  }

  private Boolean isValidIdentifier(Map<String, String> identifier) {
    return Objects.nonNull(identifier)
        && (Objects.nonNull(identifier.get("user_id"))
            || Objects.nonNull(identifier.get("anonymous_id")));
  }
}
