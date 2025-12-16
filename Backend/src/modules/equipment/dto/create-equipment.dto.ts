import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    IsUrl,
  } from 'class-validator';
  
  export class CreateEquipmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    type: string;
  
    @IsNumber()
    @Min(0)
    pricePerHour: number;
  
    @IsUrl()
    imageUrl: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  }
  