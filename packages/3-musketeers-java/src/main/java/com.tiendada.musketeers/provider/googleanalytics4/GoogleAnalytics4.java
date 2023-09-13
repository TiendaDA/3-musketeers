package com.tiendada.musketeers.provider.googleanalytics4;

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
public class GoogleAnalytics4 implements Provider {
  private static final Logger log = LoggerFactory.getLogger(GoogleAnalytics4.class);
  private final String BASE_URL = "https://www.google-analytics.com/mp/collect";
  private final String apiSecret;
  private final String measurementId;

  @Override
  public void identify(IdentifyRequest request) {
    throw new UnsupportedOperationException();
  }

  @Override
  public void track(TrackRequest request) {
    URL url;

    try {
      url = this.buildAuthenticatedUrl();
    } catch (MalformedURLException e) {
      throw new RuntimeException(e);
    }

    var eventAttributes = request.getEventAttributes();

    var utmParams = request.getUtmParams();
    if (Objects.nonNull(utmParams)) {
      if (Objects.nonNull(utmParams.getUtmCampaign())) {
        eventAttributes.put("utm_campaign", utmParams.getUtmCampaign());
      }
      if (Objects.nonNull(utmParams.getUtmSource())) {
        eventAttributes.put("utm_source", utmParams.getUtmSource());
      }
      if (Objects.nonNull(utmParams.getUtmMedium())) {
        eventAttributes.put("utm_medium", utmParams.getUtmMedium());
      }
      if (Objects.nonNull(utmParams.getUtmTerm())) {
        eventAttributes.put("utm_term", utmParams.getUtmTerm());
      }
      if (Objects.nonNull(utmParams.getUtmContent())) {
        eventAttributes.put("utm_content", utmParams.getUtmContent());
      }
    }

    var event = Map.of("name", request.getEventName(), "params", eventAttributes);
    var body =
        Map.of(
            "client_id",
            request.getIdentifier(),
            "user_id",
            request.getUserId(),
            "timestamp_micros",
            request.getTimestamp().toInstant().toEpochMilli() * 1000,
            "events",
            List.of(event));

    try {
      var response =
          Http.post(HttpOptions.builder().url(url.toString()).body(new JsonBody(body)).build());

      if (Objects.nonNull(response)) {
        log.info(
            "Tracking"
                + "[statusCode=%d][event=%s][identifier=%s]"
                    .formatted(
                        response.getStatus(), request.getEventName(), request.getIdentifier()));
      } else {
        log.warn("Empty ga4 event response [identifier=%s]".formatted(request.getIdentifier()));
      }
    } catch (IOException | URISyntaxException | HttpConfigException e) {
      log.error(
          "Could not send ga4 event http request [identifier=%s]"
              .formatted(request.getIdentifier()),
          e);
    }
  }

  private URL buildAuthenticatedUrl() throws MalformedURLException {
    return new URL(
        this.BASE_URL + "?api_secret=" + this.apiSecret + "&measurement_id=" + this.measurementId);
  }
}
