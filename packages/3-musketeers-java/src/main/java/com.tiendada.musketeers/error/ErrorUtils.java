package com.tiendada.musketeers.error;

import java.util.Objects;

/** Utility class for common error operations. */
public class ErrorUtils {
  /**
   * Effectively extracts the first available message from an exception.
   *
   * @param ex any generic exception.
   * @return the first available message.
   */
  public static String getExMessage(Exception ex) {
    if (Objects.nonNull(ex.getCause()) && Objects.nonNull(ex.getCause().getMessage())) {
      return ex.getCause().getMessage();
    }

    return Objects.nonNull(ex.getMessage()) ? ex.getMessage() : "";
  }
}
