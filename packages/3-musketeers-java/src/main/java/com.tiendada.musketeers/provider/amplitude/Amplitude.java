package com.tiendada.musketeers.provider.amplitude;

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
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class Amplitude implements Provider {
  private static final Logger log = LoggerFactory.getLogger(Amplitude.class);
  private final String BASE_URL = "https://api2.amplitude.com";
  private String apiKey;

  @Override
  public void identify(String identifier, String userId, Map<String, Object> attributes) {
    URL url;

    try {
      url = new URL(this.BASE_URL);
      url = new URL(url, "/identify");
    } catch (MalformedURLException e) {
      log.error(e.toString());
      return;
    }

    var event =
        Map.of("user_id", identifier, "event_type", "$identify", "user_properties", attributes);
    var body = Map.of("api_key", this.apiKey, "events", List.of(event));

    try {
      var response =
          Http.post(HttpOptions.builder().url(url.toString()).body(new JsonBody(body)).build());
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
      Map<String, Object> eventAttributes) {
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
            identifier,
            "event_type",
            eventName,
            "event_properties",
            eventAttributes,
            "time",
            timestamp.toInstant().toEpochMilli());
    var body = Map.of("api_key", this.apiKey, "events", List.of(event));

    try {
      var response =
          Http.post(HttpOptions.builder().url(url.toString()).body(new JsonBody(body)).build());
      log.info("Track [identifier=%s][statusCode=%s]".formatted(identifier, response.getStatus()));
    } catch (HttpConfigException | IOException | URISyntaxException e) {
      log.error("Could not Track [identifier=%s][error=%s]".formatted(identifier, e.getMessage()));
    }
  }
}
