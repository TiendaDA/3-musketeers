package com.tiendada.musketeers.provider.customerio;

import com.tiendada.musketeers.http.Http;
import com.tiendada.musketeers.http.HttpOptions;
import com.tiendada.musketeers.http.body.JsonBody;
import com.tiendada.musketeers.http.exc.HttpConfigException;
import com.tiendada.musketeers.provider.Provider;
import com.tiendada.musketeers.provider.request.IdentifyRequest;
import com.tiendada.musketeers.provider.request.TrackRequest;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class CustomerIO extends Provider {
  private static final Logger log = LoggerFactory.getLogger(CustomerIO.class);
  public static String name = "CUSTOMERIO";
  private final String SINGLE_REQUEST_URL = "https://track.customer.io/api/v2/entity";
  private String siteId;
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

    URL url;

    try {
      url = new URL(this.SINGLE_REQUEST_URL);
    } catch (MalformedURLException e) {
      log.error(e.toString());
      return;
    }

    var identifiers = Map.of("id", request.getIdentifier());
    var body =
        Map.of(
            "type",
            "person",
            "action",
            "identify",
            "identifiers",
            identifiers,
            "attributes",
            request.getIdentifier());

    try {
      var response =
          Http.put(
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

    URL url;

    try {
      url = new URL(this.SINGLE_REQUEST_URL);
    } catch (MalformedURLException e) {
      log.error(e.toString());
      return;
    }

    var campaign = new HashMap<String, String>();
    var utmParams = request.getUtmParams();
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

    var context = Map.of("campaign", campaign);

    var identifiers = new HashMap<String, String>();

    if (Objects.nonNull(identifier.get("id"))) {
      identifiers.put("id", identifier.get("id"));
    } else if (Objects.nonNull(identifier.get("email"))) {
      identifiers.put("email", identifier.get("email"));
    } else {
      identifiers.put("co_id", identifier.get("co_id"));
    }

    var body =
        Map.of(
            "type",
            "person",
            "action",
            "event",
            "identifiers",
            identifiers,
            "name",
            request.getEventName(),
            "timestamp",
            request.getTimestamp().toInstant().toEpochMilli(),
            "attributes",
            request.getEventAttributes(),
            "context",
            context);

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
              .formatted(identifiers, request.getEventName(), response.getStatus()));
    } catch (HttpConfigException | IOException | URISyntaxException e) {
      log.error("Could not Track [identifier=%s][error=%s]".formatted(identifiers, e.getMessage()));
    }
  }

  private Map<String, String> buildCredentialHeaders() {
    var credential = (this.siteId + ":" + this.apiKey).getBytes();
    return Map.of("Authorization", "Basic " + Base64.getEncoder().encodeToString(credential));
  }

  private Boolean isValidIdentifier(Map<String, String> identifier) {
    return Objects.nonNull(identifier)
        && (Objects.nonNull(identifier.get("id"))
            || Objects.nonNull(identifier.get("email"))
            || Objects.nonNull(identifier.get("co_id")));
  }
}
