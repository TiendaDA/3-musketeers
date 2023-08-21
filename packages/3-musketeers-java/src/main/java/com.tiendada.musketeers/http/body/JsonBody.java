package com.tiendada.musketeers.http.body;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import org.apache.http.entity.AbstractHttpEntity;
import org.apache.http.entity.StringEntity;

public class JsonBody implements Body {
  private final Map<String, Object> body;

  public JsonBody(Map<String, Object> body) {
    this.body = body;
  }

  @Override
  public AbstractHttpEntity toEntity() throws UnsupportedEncodingException {
    return new StringEntity(this.toString());
  }

  @Override
  public String toString() {
    ObjectMapper mapper = new ObjectMapper();
    try {
      return mapper.writeValueAsString(this.body);
    } catch (JsonProcessingException ex) {
      return "";
    }
  }
}
