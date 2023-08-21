package com.tiendada.musketeers.http;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.tiendada.musketeers.http.body.JsonBody;
import com.tiendada.musketeers.http.exc.HttpConfigException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.util.Map;
import lombok.Data;
import org.junit.jupiter.api.Test;

public class HttpTest {
  @Data
  public static class EchoResponse {
    public Map<String, String> args;
    public Map<String, String> headers;
    public String url;
    public Map<String, String> data;
    public Map<String, String> json;
    public Map<String, Object> files;
    public Map<String, Object> form;
  }

  @Test
  void syncGetRequest() throws IOException, URISyntaxException, HttpConfigException {
    var resp =
        Http.get(
            HttpOptions.<EchoResponse, String>builder()
                .url("https://postman-echo.com/get")
                .queryParams(Map.of("foo", "bar"))
                .responseCls(EchoResponse.class)
                .errorCls(String.class)
                .build());

    assertEquals(resp.getBody().getArgs().get("foo"), "bar");
  }

  @Test
  void syncPostJsonRequest() throws IOException, URISyntaxException, HttpConfigException {
    var resp =
        Http.post(
            HttpOptions.<EchoResponse, String>builder()
                .url("https://postman-echo.com/post")
                .queryParams(Map.of("foo", "bar"))
                .body(new JsonBody(Map.of("fizz", "buzz")))
                .responseCls(EchoResponse.class)
                .errorCls(String.class)
                .build());

    assertEquals(resp.getBody().getArgs().get("foo"), "bar");
    assertEquals(resp.getBody().getData().get("fizz"), "buzz");
  }

  @Test
  void asyncGetRequest() throws URISyntaxException, UnsupportedEncodingException {
    Http.getAsync(
            HttpOptions.<EchoResponse, String>builder()
                .url("https://postman-echo.com/get")
                .queryParams(Map.of("foo", "bar"))
                .responseCls(EchoResponse.class)
                .errorCls(String.class)
                .build())
        .subscribe(
            resp -> {
              assertEquals(resp.getBody().getArgs().get("foo"), "bar");
            });
    try {
      Thread.sleep(2000);
    } catch (InterruptedException ex) {
      throw new RuntimeException(ex);
    }
  }

  @Test
  void asyncPostRequest() {
    Http.postAsync(
            HttpOptions.<EchoResponse, String>builder()
                .url("https://postman-echo.com/post")
                .queryParams(Map.of("foo", "bar"))
                .body(new JsonBody(Map.of("fizz", "buzz")))
                .responseCls(EchoResponse.class)
                .errorCls(String.class)
                .build())
        .subscribe(
            resp -> {
              assertEquals(resp.getBody().getArgs().get("foo"), "bar");
              assertEquals(resp.getBody().getData().get("fizz"), "buzz");
            });
    try {
      Thread.sleep(2000);
    } catch (InterruptedException ex) {
      throw new RuntimeException(ex);
    }
  }

  @Test
  void asyncPostRequestWithoutResponseAndErrorClass() {
    Http.postAsync(
            HttpOptions.builder()
                .url("https://postman-echo.com/post")
                .queryParams(Map.of("foo", "bar"))
                .body(new JsonBody(Map.of("fizz", "buzz")))
                .build())
        .subscribe(
            resp -> {
              assertNull(resp.getBody());
              assertNull(resp.getErrorBody());
            });
    try {
      Thread.sleep(2000);
    } catch (InterruptedException ex) {
      throw new RuntimeException(ex);
    }
  }
}
