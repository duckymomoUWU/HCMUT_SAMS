// Backend/src/common/validators/is-future-booking.validator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

interface Slot {
  startTime: string;
}

@ValidatorConstraint({ async: false })
export class IsFutureBookingConstraint implements ValidatorConstraintInterface {
  private validationError = '';

  validate(value: any, args: ValidationArguments) {
    // 'value' is now the array of slots
    const slots = value as Slot[];
    if (!Array.isArray(slots) || slots.length === 0) {
      return true; // Let other validators handle empty/invalid array
    }

    const [relatedPropertyName] = args.constraints;
    const bookingDate = (args.object as any)[relatedPropertyName]; // This is bookingDate string
    if (!bookingDate) {
      return true; // Let IsNotEmpty handle missing bookingDate
    }

    const now = new Date();
    // Allow a small buffer (e.g., 1 minute) to account for request latency
    const futureThreshold = new Date(now.getTime() - (60 * 1000)); 

    for (const slot of slots) {
      if (!slot.startTime) continue; // Skip if a slot is malformed

      const [hours, minutes] = slot.startTime.split(':').map(Number);
      
      const bookingDateTime = new Date(bookingDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      if (bookingDateTime.getTime() <= futureThreshold.getTime()) {
        this.validationError = `Booking time for slot ${slot.startTime} on ${bookingDate} must be in the future.`;
        return false; // Found a slot that is not in the future
      }
    }

    return true; // All slots are valid
  }

  defaultMessage(args: ValidationArguments) {
    return this.validationError || 'One or more time slots are in the past.';
  }
}

export function IsFutureBooking(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property], // 'property' here refers to the 'bookingDate' field
      validator: IsFutureBookingConstraint,
    });
  };
}
