package com.tiendada.musketeers.http.body;

import java.io.UnsupportedEncodingException;
import org.apache.http.entity.AbstractHttpEntity;
import org.apache.http.entity.StringEntity;

public class StringBody implements Body {
  private final String body;

  public StringBody(String body) {
    this.body = body;
  }

  @Override
  public AbstractHttpEntity toEntity() throws UnsupportedEncodingException {
    return new StringEntity(this.toString());
  }

  @Override
  public String toString() {
    return this.body;
  }
}
