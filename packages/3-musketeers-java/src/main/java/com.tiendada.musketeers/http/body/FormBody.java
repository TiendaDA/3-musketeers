package com.tiendada.musketeers.http.body;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.entity.AbstractHttpEntity;
import org.apache.http.message.BasicNameValuePair;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Map;

public class FormBody implements Body {
  private final Map<String, Object> body;

  public FormBody(Map<String, Object> body) {
    this.body = body;
  }

  @Override
  public AbstractHttpEntity toEntity() throws UnsupportedEncodingException {
    ObjectMapper mapper = new ObjectMapper();
    ArrayList<NameValuePair> urlParameters = new ArrayList<>();

    for (Map.Entry<String, Object> entry : this.body.entrySet()) {
      if (entry.getValue() instanceof String) {
        urlParameters.add(new BasicNameValuePair(entry.getKey(), entry.getValue().toString()));
        continue;
      }

      try {
        var value = mapper.writeValueAsString(entry.getValue());
        urlParameters.add(new BasicNameValuePair(entry.getKey(), value));
      } catch (JsonProcessingException ignored) {
      }
    }

    return new UrlEncodedFormEntity(urlParameters);
  }
}
