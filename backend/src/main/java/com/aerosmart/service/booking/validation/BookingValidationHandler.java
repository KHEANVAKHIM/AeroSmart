package com.aerosmart.service.booking.validation;

/**
 * Handler interface / base class in the Chain of Responsibility Pattern.
 */
public abstract class BookingValidationHandler {

    protected BookingValidationHandler nextHandler;

    /**
     * Chains the next handler in the pipeline.
     */
    public BookingValidationHandler setNext(BookingValidationHandler nextHandler) {
        this.nextHandler = nextHandler;
        return nextHandler;
    }

    /**
     * Executes this handler's validation logic, then forwards to the next handler if successful.
     */
    public abstract void validate(BookingValidationContext context);

    /**
     * Helper to pass the context down the chain.
     */
    protected void passToNext(BookingValidationContext context) {
        if (nextHandler != null) {
            nextHandler.validate(context);
        }
    }
}
