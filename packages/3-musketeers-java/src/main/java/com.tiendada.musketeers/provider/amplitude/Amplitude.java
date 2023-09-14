package com.tiendada.musketeers.provider.amplitude;

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
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class Amplitude extends Provider {
  private static final Logger log = LoggerFactory.getLogger(Amplitude.class);
  public static String name = "AMPLITUDE";
  private final String BASE_URL = "https://api2.amplitude.com";
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
      url = new URL(this.BASE_URL);
      url = new URL(url, "/identify");
    } catch (MalformedURLException e) {
      log.error(e.toString());
      return;
    }

    var event =
        Map.of(
            "user_id",
            identifier.get("user_id"),
            "event_type",
            "$identify",
            "user_properties",
            request.getUserAttributes());
    var body = Map.of("api_key", this.apiKey, "events", List.of(event));

    try {
      var response =
          Http.post(HttpOptions.builder().url(url.toString()).body(new JsonBody(body)).build());
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
      url = new URL(this.BASE_URL);
      url = new URL(url, "/2/httpapi");
    } catch (MalformedURLException e) {
      log.error(e.toString());
      return;
    }

    var event =
        Map.of(
            "user_id",
            identifier.get("user_id"),
            "event_type",
            request.getEventName(),
            "event_properties",
            request.getEventAttributes(),
            "time",
            request.getTimestamp().toInstant().toEpochMilli());

    var body = Map.of("api_key", this.apiKey, "events", List.of(event));

    try {
      var response =
          Http.post(HttpOptions.builder().url(url.toString()).body(new JsonBody(body)).build());
      log.info(
          "Track [identifier=%s][statusCode=%s]"
              .formatted(request.getIdentifier(), response.getStatus()));
    } catch (HttpConfigException | IOException | URISyntaxException e) {
      log.error(
          "Could not Track [identifier=%s][error=%s]"
              .formatted(request.getIdentifier(), e.getMessage()));
    }
  }

  private Boolean isValidIdentifier(Map<String, String> identifier) {
    return Objects.nonNull(identifier) && Objects.nonNull(identifier.get("user_id"));
  }
}
