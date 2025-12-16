import { IsString, IsNumber, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { FacilityStatus, FacilityType } from '../schemas/facility.schema';

export class CreateFacilityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FacilityType)
  @IsNotEmpty()
  type: FacilityType;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsNotEmpty()
  pricePerHour: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(FacilityStatus)
  @IsOptional()
  status?: FacilityStatus;
}
