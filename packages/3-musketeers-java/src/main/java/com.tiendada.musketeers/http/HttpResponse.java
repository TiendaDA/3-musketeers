package com.tiendada.musketeers.http;

import com.tiendada.musketeers.http.exc.HttpErrorException;
import java.util.Map;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class HttpResponse<T, K> {
  private Integer status;
  private Map<String, String> headers;
  private T body;
  private K errorBody;

  public static boolean isHttpStatusError(Integer status) {
    return status / 100 != 2;
  }

  public void throwForStatus() throws HttpErrorException {
    if (HttpResponse.isHttpStatusError(this.status)) {
      throw new HttpErrorException("Http response status code was not successful");
    }
  }
}
