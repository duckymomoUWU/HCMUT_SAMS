import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, IsUrl } from "class-validator";
import { EquipmentStatus } from "../schemas/equipment.schema";

export class CreateEquipmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNumber()
    @Min(0)
    quantity: number;

    @IsNumber()
    @Min(0)
    pricePerHour: number;

    @IsEnum(EquipmentStatus)
    status: EquipmentStatus;

    @IsUrl()
    imageUrl: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}