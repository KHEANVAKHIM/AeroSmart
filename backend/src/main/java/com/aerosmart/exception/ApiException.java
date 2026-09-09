package com.aerosmart.exception;

import org.springframework.http.HttpStatus;

/**
 * Application level failure that carries the HTTP status to report to the client.
 */
public class ApiException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final HttpStatus status;

    public ApiException(String message) {
        this(HttpStatus.BAD_REQUEST, message);
    }

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status == null ? HttpStatus.BAD_REQUEST : status;
    }

    public ApiException(HttpStatus status, String message, Throwable cause) {
        super(message, cause);
        this.status = status == null ? HttpStatus.BAD_REQUEST : status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    /** Convenience factory for 409 conflicts (duplicate e-mail, seat already taken, ...). */
    public static ApiException conflict(String message) {
        return new ApiException(HttpStatus.CONFLICT, message);
    }

    /** Convenience factory for 400 bad requests. */
    public static ApiException badRequest(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }

    /** Convenience factory for 403 forbidden. */
    public static ApiException forbidden(String message) {
        return new ApiException(HttpStatus.FORBIDDEN, message);
    }
}
