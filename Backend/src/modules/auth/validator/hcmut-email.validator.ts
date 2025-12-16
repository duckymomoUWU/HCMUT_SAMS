import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsHCMUTEmailConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    // Check nếu value không phải string hoặc rỗng
    if (typeof value !== 'string' || !value) {
      return false;
    }

    // Check xem email có kết thúc bằng @hcmut.edu.vn không
    return value.toLowerCase().endsWith('@hcmut.edu.vn');
  }

  defaultMessage(): string {
    return 'Email must be a valid @hcmut.edu.vn address';
  }
}

// Decorator để sử dụng trong DTO
export function IsHCMUTEmail(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsHCMUTEmailConstraint,
    });
  };
}
