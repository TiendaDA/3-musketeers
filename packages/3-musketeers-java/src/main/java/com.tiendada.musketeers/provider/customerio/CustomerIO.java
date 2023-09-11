package com.tiendada.musketeers.provider.customerio;

import com.tiendada.musketeers.http.Http;
import com.tiendada.musketeers.http.HttpOptions;
import com.tiendada.musketeers.http.body.JsonBody;
import com.tiendada.musketeers.http.exc.HttpConfigException;
import com.tiendada.musketeers.provider.Provider;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class CustomerIO implements Provider {
  private static final Logger log = LoggerFactory.getLogger(CustomerIO.class);
  private final String SINGLE_REQUEST_URL = "https://track.customer.io/api/v2/entity";
  private String siteId;
  private String apiKey;

  @Override
  public void identify(String identifier, String userId, Map<String, Object> attributes) {
    URL url;

    try {
      url = new URL(this.SINGLE_REQUEST_URL);
    } catch (MalformedURLException e) {
      log.error(e.toString());
      return;
    }

    var identifiers = Map.of("id", identifier);
    var body =
        Map.of(
            "type",
            "person",
            "action",
            "identify",
            "identifiers",
            identifiers,
            "attributes",
            attributes);

    try {
      var response =
          Http.put(
              HttpOptions.builder()
                  .url(url.toString())
                  .headers(this.buildCredentialHeaders())
                  .body(new JsonBody(body))
                  .build());
      log.info(
          "Identify [identifier=%s][statusCode=%s]".formatted(identifier, response.getStatus()));
    } catch (HttpConfigException | IOException | URISyntaxException e) {
      log.error(
          "Could not Identify [identifier=%s][error=%s]".formatted(identifier, e.getMessage()));
    }
  }

  @Override
  public void track(
      String identifier,
      String userId,
      String eventName,
      OffsetDateTime timestamp,
      Map<String, Object> attributes) {
    URL url;

    try {
      url = new URL(this.SINGLE_REQUEST_URL);
    } catch (MalformedURLException e) {
      log.error(e.toString());
      return;
    }

    var identifiers = Map.of("id", identifier);
    var body =
        Map.of(
            "type",
            "person",
            "action",
            "event",
            "identifiers",
            identifiers,
            "name",
            eventName,
            "timestamp",
            timestamp.toInstant().toEpochMilli(),
            "attributes",
            attributes);

    try {
      var response =
          Http.post(
              HttpOptions.builder()
                  .url(url.toString())
                  .headers(this.buildCredentialHeaders())
                  .body(new JsonBody(body))
                  .build());
      log.info("Track [identifier=%s][statusCode=%s]".formatted(identifier, response.getStatus()));
    } catch (HttpConfigException | IOException | URISyntaxException e) {
      log.error("Could not Track [identifier=%s][error=%s]".formatted(identifier, e.getMessage()));
    }
  }

  private Map<String, String> buildCredentialHeaders() {
    var credential = (this.siteId + ":" + this.apiKey).getBytes();
    return Map.of("Authorization", "Basic " + Base64.getEncoder().encodeToString(credential));
  }
}