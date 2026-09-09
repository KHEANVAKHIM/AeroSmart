package com.aerosmart.exception;

/**
 * Thrown when a requested entity does not exist. Rendered as HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Builds a message of the form {@code Flight not found with id: 42}.
     *
     * @param resource human readable entity name, e.g. {@code Flight}
     * @param field    the field that was searched, e.g. {@code id}
     * @param value    the value that produced no match
     */
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(resource + " not found with " + field + ": " + value);
    }
}
