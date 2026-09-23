package com.aerosmart.service.booking.validation;

import org.springframework.stereotype.Service;

/**
 * Service that builds and executes the Chain of Responsibility pipeline for booking validation.
 */
@Service
public class BookingValidationPipeline {

    private final BookingValidationHandler pipelineHead;

    public BookingValidationPipeline() {
        // Build the Chain of Responsibility:
        // Account Status -> Seat Lock Integrity -> Passenger Compliance -> Payment Readiness
        BookingValidationHandler accountHandler = new AccountStatusValidationHandler();
        BookingValidationHandler seatLockHandler = new SeatLockIntegrityValidationHandler();
        BookingValidationHandler complianceHandler = new PassengerComplianceValidationHandler();
        BookingValidationHandler paymentHandler = new PaymentReadinessValidationHandler();

        accountHandler.setNext(seatLockHandler)
                      .setNext(complianceHandler)
                      .setNext(paymentHandler);

        this.pipelineHead = accountHandler;
    }

    /**
     * Executes the validation chain on the given context.
     * Throws ApiException if any handler in the chain rejects the request.
     */
    public void execute(BookingValidationContext context) {
        pipelineHead.validate(context);
    }
}
