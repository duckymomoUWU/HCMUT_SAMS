// Backend/src/modules/booking/dto/create-booking.dto.ts
/* eslint-disable */
import { IsString, IsNotEmpty, IsDateString, IsNumber, Min, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsFutureBooking } from '../../../common/validators/is-future-booking.validator';

class SlotDto {
  @ApiProperty({ description: 'The start time of the slot', example: '14:00' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: 'The end time of the slot', example: '15:00' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ description: 'The price of the slot', example: 50000 })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'The ID of the facility to book',
    example: '60c72b9a9b1d8c001f8e4a8b',
  })
  @IsString()
  @IsNotEmpty()
  facilityId: string;

  @ApiProperty({
    description: 'The date of the booking',
    example: '2025-12-25',
  })
  @IsDateString()
  @IsNotEmpty()
  bookingDate: string;

  @ApiProperty({
    description: 'An array of time slots to book',
    type: [SlotDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => SlotDto)
  @IsFutureBooking('bookingDate')
  slots: SlotDto[];
}

