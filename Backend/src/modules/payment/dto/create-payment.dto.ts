import { IsEnum, IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty({ message: 'Type là bắt buộc' })
  @IsEnum(['booking', 'equipment-rental'], { 
    message: 'Type phải là booking hoặc equipment-rental' 
  })
  type: string;

  @IsNotEmpty({ message: 'Reference ID là bắt buộc' })
  @IsString({ message: 'Reference ID phải là string' })
  referenceId: string;

  @IsNotEmpty({ message: 'Amount là bắt buộc' })
  @IsNumber({}, { message: 'Amount phải là số' })
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
