// Backend/src/modules/booking/dto/update-booking.dto.ts
/* eslint-disable */
import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}