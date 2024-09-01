package com.tiendada.musketeers.http;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tiendada.musketeers.error.ErrorUtils;
import com.tiendada.musketeers.http.body.FormBody;
import com.tiendada.musketeers.http.body.JsonBody;
import com.tiendada.musketeers.http.body.StringBody;
import com.tiendada.musketeers.http.exc.HttpConfigException;
import com.tiendada.musketeers.http.exc.HttpErrorException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Collectors;
import org.apache.http.HttpHeaders;
import org.apache.http.NameValuePair;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.concurrent.FutureCallback;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.impl.nio.client.HttpAsyncClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

public class Http {
  private static final Logger log = LoggerFactory.getLogger(Http.class);

  private static <T, K> void configureRequestBase(
      HttpRequestBase requestBase, HttpOptions<T, K> options)
      throws URISyntaxException, UnsupportedEncodingException {

    // query params
    if (options.getQueryParams() != null) {
      URIBuilder uriBuilder = new URIBuilder(requestBase.getURI());
      options.getQueryParams().forEach(uriBuilder::addParameter);
      URI uri = uriBuilder.build();
      requestBase.setURI(uri);
    }

    // default headers
    requestBase.setHeader(HttpHeaders.USER_AGENT, "tiendada");
    requestBase.setHeader(HttpHeaders.ACCEPT, "*/*");

    // content type
    if (Objects.nonNull(options.getBody())) {
      if (options.getBody() instanceof JsonBody) {
        requestBase.setHeader(HttpHeaders.CONTENT_TYPE, "application/json");
      } else if (options.getBody() instanceof StringBody) {
        requestBase.setHeader(HttpHeaders.CONTENT_TYPE, "text/plain");
      } else if (options.getBody() instanceof FormBody) {
        requestBase.setHeader(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded");
      }

      // body
      if (requestBase instanceof HttpPost) {
        ((HttpPost) requestBase).setEntity(options.getBody().toEntity());
      } else if (requestBase instanceof HttpPut) {
        ((HttpPut) requestBase).setEntity(options.getBody().toEntity());
      }
    }

    // headers
    if (Objects.nonNull(options.getHeaders())) {
      options.getHeaders().forEach(requestBase::setHeader);
    }
  }

  private static <T, K> HttpResponse.HttpResponseBuilder<T, K> configureResponse(
      org.apache.http.HttpResponse response, HttpOptions<T, K> options)
      throws IOException, HttpConfigException {

    int status = response.getStatusLine().getStatusCode();
    // headers
    var headers =
        Arrays.stream(response.getAllHeaders())
            .collect(Collectors.toMap(NameValuePair::getName, NameValuePair::getValue));

    var builder = HttpResponse.<T, K>builder().status(status).headers(headers);

    var entity = response.getEntity();

    if (Objects.nonNull(entity)) {
      var iss = entity.getContent();

      if (iss.available() > 0) {
        ObjectMapper mapper = new ObjectMapper();

        if (!HttpResponse.isHttpStatusError(status)) {
          if (Objects.nonNull(options.getResponseCls())) {
            builder = builder.body(mapper.readValue(iss, options.getResponseCls()));
          } else {
            log.warn(
                "There is a response body, but it will not be returned "
                    + "since no response class has been provided");
          }
        } else {
          if (Objects.nonNull(options.getErrorCls())) {
            builder = builder.errorBody(mapper.readValue(iss, options.getErrorCls()));
          } else {
            log.warn(
                "There is a response error, but it will not be returned "
                    + "since no error class has been provided");
          }
        }
      }
    }
    return builder;
  }

  private static <T, K> Mono<HttpResponse<T, K>> requestAsync(
      HttpRequestBase requestBase, HttpOptions<T, K> options) {

    try {
      configureRequestBase(requestBase, options);
    } catch (UnsupportedEncodingException | URISyntaxException ex) {
      return Mono.error(ex);
    }

    return Mono.create(
        consumer -> {
          // This is fine, we close it at the end
          var client = HttpAsyncClients.createDefault();
          client.start();

          client.execute(
              requestBase,
              new FutureCallback<>() {
                @Override
                public void completed(org.apache.http.HttpResponse response) {
                  try {
                    var responseBuilder = configureResponse(response, options);
                    consumer.success(responseBuilder.build());
                  } catch (IOException | HttpConfigException ex) {
                    consumer.error(ex);
                  }
                  try {
                    client.close();
                  } catch (IOException e) {
                    log.error(ErrorUtils.getExMessage(e));
                  }
                }

                @Override
                public void failed(Exception ex) {
                  consumer.error(ex);
                  try {
                    client.close();
                  } catch (IOException e) {
                    log.error(ErrorUtils.getExMessage(e));
                  }
                }

                @Override
                public void cancelled() {
                  consumer.error(new HttpErrorException("Http request cancelled"));
                  try {
                    client.close();
                  } catch (IOException e) {
                    log.error(ErrorUtils.getExMessage(e));
                  }
                }
              });
        });
  }

  private static <T, K> HttpResponse<T, K> request(
      HttpRequestBase requestBase, HttpOptions<T, K> options)
      throws URISyntaxException, IOException, HttpConfigException {

    configureRequestBase(requestBase, options);

    var respBuilder = HttpResponse.<T, K>builder();

    try (var client = HttpClients.createDefault()) {
      try (var response = client.execute(requestBase)) {
        respBuilder = configureResponse(response, options);
      }
    }

    return respBuilder.build();
  }

  public static <T, K> HttpResponse<T, K> get(HttpOptions<T, K> options)
      throws IOException, URISyntaxException, HttpConfigException {
    var httpGet = new HttpGet(options.getUrl());
    return request(httpGet, options);
  }

  public static <T, K> HttpResponse<T, K> post(HttpOptions<T, K> options)
      throws IOException, URISyntaxException, HttpConfigException {
    var httpPost = new HttpPost(options.getUrl());
    return request(httpPost, options);
  }

  public static <T, K> HttpResponse<T, K> put(HttpOptions<T, K> options)
      throws IOException, URISyntaxException, HttpConfigException {
    var httpPut = new HttpPut(options.getUrl());
    return request(httpPut, options);
  }

  public static <T, K> Mono<HttpResponse<T, K>> getAsync(HttpOptions<T, K> options) {
    HttpGet httpGet = new HttpGet(options.getUrl());
    return requestAsync(httpGet, options);
  }

  public static <T, K> Mono<HttpResponse<T, K>> postAsync(HttpOptions<T, K> options) {
    var httpPost = new HttpPost(options.getUrl());
    return requestAsync(httpPost, options);
  }
}
