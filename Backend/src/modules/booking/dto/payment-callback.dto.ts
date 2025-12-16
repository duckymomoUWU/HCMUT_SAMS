// Backend/src/modules/booking/dto/payment-callback.dto.ts

import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentCallbackDto {
  @ApiProperty({
    description: 'The ID of the booking being processed.',
    example: '60c72b9a9b1d8c001f8e4a8b',
  })
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({
    description: "The status of the payment transaction, either 'success' or 'failed'.",
    example: 'success',
    enum: ['success', 'failed'],
  })
  @IsIn(['success', 'failed'])
  @IsNotEmpty()
  status: 'success' | 'failed';

  @ApiProperty({
    description: 'Optional: The transaction amount, for verification.',
    example: 200000,
    required: false,
  })
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Optional: The payment gateway transaction reference.',
    example: 'TXN12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  txnRef?: string;
}
