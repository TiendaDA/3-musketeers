package com.tiendada.musketeers.http.body;

import java.io.UnsupportedEncodingException;
import org.apache.http.entity.AbstractHttpEntity;

public interface Body {
  public AbstractHttpEntity toEntity() throws UnsupportedEncodingException;

  public String toString();
}
