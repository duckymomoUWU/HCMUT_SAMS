import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FacilityDocument = Facility & Document;

export enum FacilityType {
  FOOTBALL = 'Football',
  BADMINTON = 'Badminton',
  GYM = 'Gym',
}

export enum FacilityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true })
export class Facility {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: FacilityType })
  type: FacilityType;

  @Prop()
  location: string;

  @Prop({ required: true })
  pricePerHour: number;

  @Prop()
  description: string;

  @Prop({ enum: FacilityStatus, default: FacilityStatus.ACTIVE })
  status: FacilityStatus;
}

export const FacilitySchema = SchemaFactory.createForClass(Facility);
