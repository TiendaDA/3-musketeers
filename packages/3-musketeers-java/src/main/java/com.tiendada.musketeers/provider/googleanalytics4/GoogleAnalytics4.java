package com.tiendada.musketeers.provider.googleanalytics4;

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
import java.util.Objects;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
public class GoogleAnalytics4 implements Provider {
  private static final Logger log = LoggerFactory.getLogger(GoogleAnalytics4.class);
  private final String BASE_URL = "https://www.google-analytics.com/mp/collect";
  private final String apiSecret;
  private final String measurementId;

  @Override
  public void identify(String userId, Map<String, Object> attributes) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void track(
      String identifier,
      String eventName,
      OffsetDateTime timestamp,
      Map<String, Object> attributes) {
    URL url;

    try {
      url = this.buildAuthenticatedUrl();
    } catch (MalformedURLException e) {
      throw new RuntimeException(e);
    }

    var event = Map.of("name", eventName, "params", attributes);
    // TODO: handle timestamp_micros
    var body = Map.of("clientId", identifier, "events", List.of(event));

    try {
      var response =
          Http.post(HttpOptions.builder().url(url.toString()).body(new JsonBody(body)).build());

      if (Objects.nonNull(response)) {
        log.info(
            "Tracking"
                + "[statusCode=%d][event=%s][identifier=%s]"
                    .formatted(response.getStatus(), eventName, identifier));
      } else {
        log.warn("Empty ga4 event response [identifier=%s]".formatted(identifier));
      }
    } catch (IOException | URISyntaxException | HttpConfigException e) {
      log.error("Could not send ga4 event http request [identifier=%s]".formatted(identifier), e);
    }
  }

  private URL buildAuthenticatedUrl() throws MalformedURLException {
    return new URL(
        this.BASE_URL + "?api_secret=" + this.apiSecret + "&measurement_id=" + this.measurementId);
  }
}
