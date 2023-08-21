package com.tiendada.musketeers.http;

import com.tiendada.musketeers.http.body.Body;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HttpOptions<T, K> {
  private String url;
  private Map<String, String> queryParams;
  private Map<String, String> headers;
  private Body body;
  private Class<T> responseCls;
  private Class<K> errorCls;
}
